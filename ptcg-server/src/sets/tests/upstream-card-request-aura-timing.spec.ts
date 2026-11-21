import { CardTag } from '../../game/store/card/card-types';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { State } from '../../game/store/state/state';
import { playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const iron = 'Iron Boulder ex TEF';
const fighting = 'Fighting Energy SVE';
const metal = 'Metal Energy SVE';
const water = 'Water Energy SVE';
const lucian = 'Lucian TWM';
const floatzel = 'Floatzel ex FLO';
const passion = "Crasher Wake's Passion FLO";
const revavroom = 'Revavroom FLO';
const machamp = 'Machamp FLO';

function battle(first: PlayerConfig, second: PlayerConfig) {
  const board = setupGame({ turn: 5,
    player1: { deck: padDeck(10), ...first }, player2: { deck: padDeck(10), ...second },
  });
  board.player2.active.getPokemonCard()!.hp = 900;
  return board;
}

function observe(board: ReturnType<typeof battle>, observer: (effect: Effect) => void) {
  const reduce = board.store.reduceEffect.bind(board.store);
  spyOn(board.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    observer(effect);
    return reduce(state, effect);
  });
}

describe('Card request and Aura Seeker effect timing', () => {
  for (const ownHand of [true, false]) {
    it(`Lucian bottoms both hands before either coin when the user ${ownHand ? 'has another card' : 'only has Lucian'}`, () => {
      const board = battle({ active: { card: mew }, hand: ownHand ? [lucian, metal] : [lucian] },
        { active: { card: mew }, hand: [water] });
      const opponentCard = board.player2.hand.cards[0];
      const flippers: number[] = [];
      observe(board, effect => {
        if (!(effect instanceof CoinFlipEffect)) return;
        if (!flippers.length) expect(board.player2.deck.cards[board.player2.deck.cards.length - 1]).toBe(opponentCard);
        flippers.push(effect.player.id);
        effect.forcedResult = effect.player === board.player1;
      });
      playTrainerCard(board.store, board.state, 0, lucian);
      expect(flippers).toEqual([board.player1.id, board.player2.id]);
      expect([board.player1.hand.cards.length, board.player2.hand.cards.length]).toEqual([6, 3]);
    });
  }

  it('Lucian can move the opponent’s hand when the user has an empty deck', () => {
    const board = battle({ active: { card: mew }, hand: [lucian], deck: [] }, { active: { card: mew }, hand: [water] });
    const opponentCard = board.player2.hand.cards[0];
    playTrainerCard(board.store, board.state, 0, lucian);
    expect(board.player1.hand.cards.length).toBe(0);
    expect(board.player2.deck.cards).toContain(opponentCard);
  });

  it('Lucian skips the coins if the only attempted move is prevented', () => {
    const board = battle({ active: { card: mew }, hand: [lucian] }, { active: { card: mew }, hand: [water] });
    let flips = 0;
    observe(board, effect => {
      if (effect instanceof CoinFlipEffect) flips++;
      if (effect instanceof MoveCardsEffect && effect.source === board.player2.hand) effect.preventDefault = true;
    });
    playTrainerCard(board.store, board.state, 0, lucian);
    expect(flips).toBe(0);
    expect(board.player2.hand.cards.length).toBe(1);
  });

  it('Power Stomp damages and then discards two attached Energy units', () => {
    const board = battle({ active: { card: iron, energy: [fighting, fighting, fighting] } }, { active: { card: mew } });
    let damageWhenDiscarding: number | undefined;
    observe(board, effect => {
      if (effect instanceof DiscardCardsEffect && effect.target === board.player1.active) damageWhenDiscarding = board.player2.active.damage;
    });
    useAttack(board.store, board.state, 0, 'Power Stomp');
    expect(damageWhenDiscarding).toBe(170);
    expect(board.player1.active.energies.cards.length).toBe(1);
  });

  it('copied Power Stomp can discard two units from one Double Turbo Energy', () => {
    const board = battle({ active: { card: 'Clefable TWM', energy: ['Double Turbo Energy BRS'] } }, { active: { card: iron } });
    board.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Power Stomp' }));
    useAttack(board.store, board.state, 0, 'Metronome');
    expect(board.player2.active.damage).toBe(180);
    expect(board.player1.active.energies.cards.length).toBe(0);
    expect(board.state.activePlayer).toBe(1);
  });

  it('Trained Arms bypasses Resistance but leaves Knock Out provenance to the damage engine', () => {
    const board = battle({ active: { card: machamp, energy: Array(4).fill(fighting) } }, { active: { card: 'Mew ex 30C' } });
    let attackerDamageWhenMainDamageResolves: number | undefined;
    observe(board, effect => {
      if (effect instanceof PutDamageEffect && effect.target === board.player2.active) {
        attackerDamageWhenMainDamageResolves = board.player1.active.damage;
      }
    });
    const move = board.player1.active.getPokemonCard()!.attacks[0];
    useAttack(board.store, board.state, 0, 'Guts Fight');
    expect(board.player2.active.damage).toBe(250);
    expect(attackerDamageWhenMainDamageResolves).toBe(0);
    expect(board.player1.active.damage).toBe(20);
    expect(move.shredAttack).toBeFalsy();
  });

  it('Guts Fight still deals recoil when Trained Arms is suppressed', () => {
    const board = battle({ active: { card: machamp, energy: Array(4).fill(fighting) } }, { active: { card: 'Flutter Mane TEF' } });
    useAttack(board.store, board.state, 0, 'Guts Fight');
    expect(board.player2.active.damage).toBe(250);
    expect(board.player1.active.damage).toBe(20);
  });

  it('Hustle Screw reveals while the cards are still in hand, then shuffles after damage', () => {
    const board = battle({ active: { card: floatzel, energy: [water, water] }, hand: [passion, passion, water] }, { active: { card: mew } });
    const revealed = board.player1.hand.cards.slice(0, 2);
    let shown = false;
    let movedAtDamage: number | undefined;
    board.overridePrompt('Choose cards', () => [0, 1]);
    board.overridePrompt('Show cards', () => {
      shown = true;
      expect(revealed.every(card => board.player1.hand.cards.includes(card))).toBe(true);
      expect(board.player2.active.damage).toBe(0);
      return true;
    });
    observe(board, effect => {
      if (effect instanceof MoveCardsEffect && effect.source === board.player1.hand && effect.destination === board.player1.deck) {
        movedAtDamage = board.player2.active.damage;
      }
    });
    useAttack(board.store, board.state, 0, 'Hustle Screw');
    expect(shown).toBe(true);
    expect(movedAtDamage).toBe(240);
    expect(revealed.every(card => board.player1.deck.cards.includes(card))).toBe(true);
  });

  for (const [card, mega] of [
    [floatzel, false], ['Sigilyph ex FLO', false], ['Mega Lucario Z ex FLO', true],
    ['Mega Garchomp Z ex FLO', true], ['Mega Absol Z ex FLO', true],
  ] as const) {
    it(`${card} has the gameplay tags for its printed Prize rule`, () => {
      const registered = getCardByName(card);
      expect(registered.tags).toContain(CardTag.POKEMON_ex);
      expect(registered.tags.includes(CardTag.POKEMON_SV_MEGA)).toBe(mega);
    });
  }

  it('Mega Protection recognizes a canonical Mega ex attacker', () => {
    const board = battle({ active: { card: 'Mega Kangaskhan ex M1S', energy: [metal, water, water] } },
      { active: { card: 'Sigilyph ex FLO' } });
    spyOn(Math, 'random').and.returnValue(0.9);
    useAttack(board.store, board.state, 0, 'Rapid-Fire Combo');
    expect(board.player2.active.damage).toBe(0);
  });

  it('Dancing Fist gains 120 damage against a canonical Pokémon ex', () => {
    const board = battle({ active: { card: 'Mega Lucario Z ex FLO', energy: [metal, metal] } },
      { active: { card: mew } });
    useAttack(board.store, board.state, 0, 'Dancing Fist');
    expect(board.player2.active.damage).toBe(240);
  });

  it('Aura Seeker cannot be used while Mega Lucario Z ex is Benched', () => {
    const board = battle({ active: { card: mew }, bench: [{ card: 'Mega Lucario Z ex FLO' }], deck: [lucian] },
      { active: { card: mew } });
    expect(() => useAbility(board.store, board.state, 0, 'Aura Seeker')).toThrow();
    expect(board.player1.hand.cards.length).toBe(0);
  });

  for (const copied of [false, true]) {
    it(`Long Drive damages both targets before discarding the actual attacker’s Energy (${copied ? 'Memory Helix' : 'direct'})`, () => {
      const board = battle({ active: { card: copied ? 'Mew ex 30C' : revavroom, energy: [metal, metal, metal] },
        bench: copied ? [{ card: revavroom, energy: [metal] }] : [] },
      { active: { card: mew }, bench: [{ card: mew }] });
      let damageAtDiscard: number[] | undefined;
      board.overridePrompt('Choose pokemon', () => [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }]);
      observe(board, effect => {
        if (effect instanceof DiscardCardsEffect) damageAtDiscard = [board.player2.active.damage, board.player2.bench[0].damage];
      });
      if (copied) {
        board.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Long Drive' }));
        useAbility(board.store, board.state, 0, 'Memory Helix');
      } else {
        useAttack(board.store, board.state, 0, 'Long Drive');
      }
      expect(damageAtDiscard).toEqual([100, 100]);
      expect(board.player1.active.energies.cards.length).toBe(0);
      if (copied) expect(board.player1.bench[0].energies.cards.length).toBe(1);
    });
  }
});
