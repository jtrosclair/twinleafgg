import { PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame } from './test-helpers';
import { playTrainerCard, useAttack } from './card-test-helpers';

const mew = 'Mew ex MEW';
const darkness = 'Darkness Energy SVE';
const lightning = 'Lightning Energy SVE';
const metal = 'Metal Energy SVE';
const pecharunt = 'Pecharunt ASC';
const exeggutor = "Team Rocket's Exeggutor ASC";
const mist = 'Mist Energy TEF';
const rolling = 'Spiky Rolling';
const opposingBench = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };

describe('Ascended Heroes attack resolution', () => {
  it('Final Chain searches when Pecharunt takes lethal attack damage', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Miraidon ex SVI', energy: [lightning, lightning, darkness] }, deck: padDeck(10) },
      player2: { active: { card: pecharunt }, bench: [{ card: mew }], deck: ['Potion BS', ...padDeck(6)] }
    });
    const selected = game.player2.deck.cards[0];
    game.overridePrompt('Choose cards', prompt => {
      const source = (prompt as ChooseCardsPrompt).cards;
      return [source.cards.indexOf(selected)];
    });
    useAttack(game.store, game.state, 0, 'Photon Blaster');
    expect(game.player2.hand.cards).toContain(selected);
  });

  for (const protection of [mist, undefined]) {
    it(`Tri Kinesis ${protection ? 'respects Mist Energy' : 'Knocks Out the selected Bench target without triggering Final Chain'}`, () => {
      spyOn(Math, 'random').and.returnValue(0.1);
      const game = setupGame({
        turn: 5,
        player1: { active: { card: exeggutor, energy: [darkness, darkness] }, deck: padDeck(10) },
        player2: { active: { card: mew }, bench: [{ card: pecharunt, energy: protection ? [protection] : [] }],
          deck: ['Potion BS', ...padDeck(6)] }
      });
      const target = game.player2.bench[0].getPokemonCard()!;
      const deckSize = game.player2.deck.cards.length;
      game.overridePrompt('Choose pokemon', () => [opposingBench]);
      let searches = 0;
      game.overridePrompt('Choose cards', () => { searches++; return [0]; });
      useAttack(game.store, game.state, 0, 'Tri Kinesis');
      expect(game.player2.discard.cards.includes(target)).toBe(!protection);
      expect(game.player2.active.getPokemonCard()?.fullName).toBe(mew);
      expect(game.player1.getPrizeLeft()).toBe(protection ? 6 : 5);
      expect(game.player2.deck.cards.length).toBe(deckSize - 1);
      expect(searches).toBe(0);
    });
  }

  it('does not let damage dealt elsewhere trigger Final Chain when Phantom Dive places counters on Pecharunt', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Dragapult ex TWM', energy: ['Fire Energy SVE', 'Psychic Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Arceus VSTAR BRS' }, bench: [{ card: pecharunt, damage: 20 }], deck: padDeck(8) }
    });
    const target = game.player2.bench[0].getPokemonCard()!;
    game.overridePrompt('Put damage', () => [{ target: opposingBench, damage: 60 }]);
    let searches = 0;
    game.overridePrompt('Choose cards', () => { searches++; return [0]; });

    useAttack(game.store, game.state, 0, 'Phantom Dive');
    expect(game.player2.active.damage).toBe(200);
    expect(game.player2.discard.cards).toContain(target);
    expect(searches).toBe(0);
  });

  it('Vulture Claw deals attack damage before discarding from the opposing hand', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Mandibuzz ex ASC', energy: [darkness, darkness, darkness] }, deck: padDeck(10) },
      player2: { active: { card: 'Regigigas ASR' }, hand: ['Potion BS'], deck: padDeck(8) }
    });
    const { player1, player2, store, state } = game;
    const reduce = store.reduceEffect.bind(store);
    const discard = player2.hand.cards[0];
    let damageWhenDiscarded: number | undefined;
    spyOn(store, 'reduceEffect').and.callFake((current: State, effect: Effect) => {
      if (effect instanceof MoveCardsEffect && effect.source === player2.hand && effect.destination === player2.discard) {
        damageWhenDiscarded = player2.active.damage;
        expect(effect.sourceCard).toBe(player1.active.getPokemonCard());
      }
      return reduce(current, effect);
    });
    useAttack(store, state, 0, 'Vulture Claw');
    expect(damageWhenDiscarded).toBe(160);
    expect(player2.discard.cards).toContain(discard);
  });

  for (const skipped of [false, true]) {
    it(`Spiky Rolling ${skipped ? 'expires after an intervening pass' : 'keeps its bonus after switching to the Bench and back'}`, () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: 'Togedemaru ex ASC', energy: [metal, metal] }, bench: [{ card: mew }],
          hand: ['Switch SVI', 'Switch SVI'], deck: padDeck(10) },
        player2: { active: { card: 'Regigigas ASR' }, deck: padDeck(10) }
      });
      const { player1, player2, store, state, overridePrompt } = game;
      const defender = player2.active.getPokemonCard() as PokemonCard;
      defender.hp = 1000;
      defender.weakness = [];
      defender.resistance = [];
      useAttack(store, state, 0, rolling);
      expect(player2.active.damage).toBe(80);
      store.dispatch(new PassTurnAction(player2.id));
      if (skipped) {
        store.dispatch(new PassTurnAction(player1.id));
        store.dispatch(new PassTurnAction(player2.id));
      } else {
        for (let i = 0; i < 2; i++) {
          overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }]);
          playTrainerCard(store, state, 0, 'Switch SVI');
        }
      }
      useAttack(store, state, 0, rolling);
      expect(player2.active.damage).toBe(skipped ? 160 : 240);
    });
  }
});
