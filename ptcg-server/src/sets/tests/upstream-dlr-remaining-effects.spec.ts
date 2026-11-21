import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MovedToActiveEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect, AfterAttachEnergyEffect, AttachEnergyEffect, CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChooseEnergyPromptType } from '../../game/store/prompts/choose-energy-prompt';
import { DiscardEnergyPromptType } from '../../game/store/prompts/discard-energy-prompt';
import { State } from '../../game/store/state/state';
import { playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const fire = 'Fire Energy SVE';
const electric = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const grass = 'Grass Energy SVE';
const fighting = 'Fighting Energy SVE';
const mew = 'Mew ex MEW';
const guard = 'Koraidon ex SVI';
const magmortar = 'Magmortar M6';
const electivire = 'Electivire M6';
const cap = 'Mega Rayquaza Cap M6';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const zinnia = "Zinnia's Trust M6";

function battle(first: PlayerConfig, second: PlayerConfig = { active: { card: guard } }) {
  const board = setupGame({ turn: 5, player1: { deck: padDeck(10), ...first }, player2: { deck: padDeck(10), ...second } });
  board.player2.active.getPokemonCard()!.hp = 1000;
  return board;
}

function observe(board: ReturnType<typeof battle>, observer: (effect: Effect) => void) {
  const reduce = board.store.reduceEffect.bind(board.store);
  spyOn(board.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    observer(effect);
    return reduce(state, effect);
  });
}

describe('Delta Reign remaining printed effects', () => {
  it('Buddy Boost can use its allowed recipient while a hand attachment to the other is blocked', () => {
    const board = battle({ active: { card: magmortar }, bench: [{ card: electivire }], hand: [fire, electric] });
    const [first, second] = board.player1.hand.cards;
    board.player1.active.energyAttachBlockedFromHandNextTurn = true;
    board.player1.energyPlayedTurn = board.state.turn;
    let completions = 0;
    observe(board, effect => {
      if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === second) completions++;
    });
    board.overridePrompt(AttachEnergyPromptType, prompt => {
      expect((prompt as AttachEnergyPrompt).options.blockedTo).toContain(active);
      return [{ index: 1, to: bench }];
    });
    useAbility(board.store, board.state, 0, 'Buddy Boost');
    expect(board.player1.hand.cards).toContain(first);
    expect(board.player1.bench[0].energies.cards).toContain(second);
    expect(completions).toBe(1);
  });

  it('Buddy Boost emits both hand reactions after both physical attachments', () => {
    const board = battle({ active: { card: magmortar }, bench: [{ card: electivire }], hand: [fire, electric] });
    const [first, second] = board.player1.hand.cards;
    let completions = 0;
    observe(board, effect => {
      if (effect instanceof AfterAttachEnergyFromHandEffect) {
        expect(board.player1.active.energies.cards).toContain(first);
        expect(board.player1.bench[0].energies.cards).toContain(second);
        completions++;
      }
    });
    board.overridePrompt(AttachEnergyPromptType, () => [{ index: 0, to: active }, { index: 1, to: bench }]);
    useAbility(board.store, board.state, 0, 'Buddy Boost');
    expect(completions).toBe(2);
    expect(board.player1.energyPlayedTurn).not.toBe(board.state.turn);
  });

  it('Buddy Boost cannot be declared when every recipient is blocked', () => {
    const board = battle({ active: { card: magmortar }, hand: [fire] });
    board.player1.active.energyAttachBlockedFromHandNextTurn = true;
    expect(() => useAbility(board.store, board.state, 0, 'Buddy Boost')).toThrow();
    expect(board.player1.hand.cards.length).toBe(1);
    expect(board.player1.active.energies.cards.length).toBe(0);
  });

  it('Buddy Boost can be cancelled without spending the Ability', () => {
    const board = battle({ active: { card: magmortar }, hand: [fire] });
    board.overridePrompt(AttachEnergyPromptType, () => null);
    useAbility(board.store, board.state, 0, 'Buddy Boost');
    board.overridePrompt(AttachEnergyPromptType, () => [{ index: 0, to: active }]);
    useAbility(board.store, board.state, 0, 'Buddy Boost');
    expect(board.player1.active.energies.cards.length).toBe(1);
  });

  for (const blocked of [false, true]) {
    it(`Delta Gift checks deck attachment before shuffling, recipient blocked: ${blocked}`, () => {
      const board = battle({ active: { card: magmortar, energy: [electric], tools: [cap] }, deck: [fire, ...padDeck(9)] });
      const energy = board.player1.deck.cards[0];
      const order: string[] = [];
      observe(board, effect => {
        if (effect instanceof AttachEnergyEffect && effect.energyCard === energy) {
          expect(effect.sourceZone).toBe('deck');
          expect(board.player1.deck.cards).toContain(energy);
          effect.preventDefault = blocked;
          if (!order.includes('attach')) order.push('attach');
        }
        if (effect instanceof AfterAttachEnergyEffect && effect.energyCard === energy) order.push('react');
      });
      board.overridePrompt(AttachEnergyPromptType, () => [{ index: 0, to: active }]);
      board.overridePrompt('Shuffle deck', () => {
        order.push('shuffle');
        return board.player1.deck.cards.map((_, index) => index);
      });
      useAttack(board.store, board.state, 0, 'Delta Gift');
      expect(order).toEqual(blocked ? ['attach', 'shuffle'] : ['attach', 'shuffle', 'react']);
      expect(board.player1.deck.cards.includes(energy)).toBe(blocked);
      expect(board.player1.active.energies.cards.includes(energy)).toBe(!blocked);
    });
  }

  it('Rewarm preserves the damage modifier and returns Basic Fire only after damage', () => {
    const board = battle({ active: { card: 'Heat Rotom ex M6', energy: [water, water] }, discard: [fire, fire, electric] });
    const basicFire = board.player1.discard.cards.slice(0, 2);
    observe(board, effect => {
      if (effect instanceof AttackEffect && effect.attack.name === 'Rewarm') effect.damage += 10;
      if (effect instanceof DealDamageEffect) expect(board.player1.discard.cards).toEqual(jasmine.arrayContaining(basicFire));
    });
    useAttack(board.store, board.state, 0, 'Rewarm');
    expect(board.player2.active.damage).toBe(70);
    expect(board.player1.deck.cards).toEqual(jasmine.arrayContaining(basicFire));
    expect(board.player1.discard.cards.map(card => card.fullName)).toEqual([electric]);
  });

  it('Strong Flare discards the selected two Energy units after dealing damage', () => {
    const board = battle({ active: { card: 'Heat Rotom ex M6', energy: [fire, fire, water] } });
    board.overridePrompt(ChooseEnergyPromptType, () => {
      expect(board.player2.active.damage).toBe(170);
      return [0, 1];
    });
    useAttack(board.store, board.state, 0, 'Strong Flare');
    expect(board.player1.active.energies.cards.map(card => card.fullName)).toEqual([water]);
  });

  it('Heat Tackle deals outgoing damage before recoil', () => {
    const board = battle({ active: { card: 'Arcanine M6', energy: [fire, fire, water, water] } });
    const order: string[] = [];
    observe(board, effect => {
      if (effect instanceof DealDamageEffect) order.push(effect.target === board.player1.active ? 'recoil' : 'attack');
    });
    useAttack(board.store, board.state, 0, 'Heat Tackle');
    expect(order).toEqual(['attack', 'recoil']);
    expect(board.player1.active.damage).toBe(50);
  });

  it('Destructive Flame flips after damage and discards an Energy on heads', () => {
    const board = battle({ active: { card: 'Heatmor M6', energy: [fire] } }, { active: { card: guard, energy: [water] } });
    const energy = board.player2.active.energies.cards[0];
    observe(board, effect => {
      if (effect instanceof CoinFlipEffect) {
        expect(board.player2.active.damage).toBe(30);
        effect.forcedResult = true;
      }
    });
    board.overridePrompt('Choose cards', prompt => [(prompt as ChooseCardsPrompt).cards.cards.indexOf(energy)]);
    useAttack(board.store, board.state, 0, 'Destructive Flame');
    expect(board.player2.discard.cards).toContain(energy);
  });

  it('Make Waves empties both hands before shuffling and draws from the shuffled decks', () => {
    const board = battle({ active: { card: 'Mantine M6', energy: [water] }, hand: [fire] },
      { active: { card: guard }, hand: [electric] });
    const own = board.player1.hand.cards[0];
    const other = board.player2.hand.cards[0];
    const order = (cards: unknown[]) => cards.map((_, index) => cards.length - index - 1);
    board.overridePrompt('Shuffle deck', () => {
      expect(board.player1.hand.cards.length).toBe(0);
      expect(board.player2.hand.cards.length).toBe(0);
      board.overridePrompt('Shuffle deck', () => order(board.player2.deck.cards));
      return order(board.player1.deck.cards);
    });
    useAttack(board.store, board.state, 0, 'Make Waves');
    expect(board.player1.hand.cards.length).toBe(4);
    expect(board.player1.hand.cards).toContain(own);
    expect(board.player2.hand.cards).toContain(other);
  });

  it('Bubble Drain damages its defender before healing its attacker', () => {
    const board = battle({ active: { card: 'Mantine M6', energy: [water, water], damage: 50 } });
    let healChecked = false;
    observe(board, effect => {
      if (effect instanceof HealTargetEffect) {
        expect(board.player2.active.damage).toBe(30);
        healChecked = true;
      }
    });
    useAttack(board.store, board.state, 0, 'Bubble Drain');
    expect(healChecked).toBe(true);
    expect(board.player1.active.damage).toBe(20);
  });

  it('Brutal Whirlpool deals the Active hit before Bench damage from a Legendary Stadium', () => {
    const board = battle({ active: { card: 'Kyogre M6', energy: [water, water, grass] } },
      { active: { card: guard }, bench: [{ card: mew }] });
    board.player1.stadium.cards.push(getCardByName('Legendary Summit (Left) M6'), getCardByName('Legendary Summit (Right) M6'));
    const order: string[] = [];
    observe(board, effect => {
      if (effect instanceof PutDamageEffect) order.push(effect.target === board.player2.active ? 'active' : 'bench');
    });
    useAttack(board.store, board.state, 0, 'Brutal Whirlpool');
    expect(order).toEqual(['active', 'bench']);
    expect(board.player2.bench[0].damage).toBe(50);
  });

  it('Gaia Crush keeps the Stadium in play during damage and discards it afterward', () => {
    const board = battle({ active: { card: 'Landorus M6', energy: [fighting, fighting, fighting] } });
    const stadium = getCardByName('Artazon PAL');
    board.player1.stadium.cards.push(stadium);
    observe(board, effect => {
      if (effect instanceof DealDamageEffect) expect(board.player1.stadium.cards).toContain(stadium);
    });
    useAttack(board.store, board.state, 0, 'Gaia Crush');
    expect(board.player1.discard.cards).toContain(stadium);
  });

  it('Thunderous Edge bypasses prevention using the normal damage effect', () => {
    const board = battle({ active: { card: 'Thundurus M6', energy: [electric, water, water] } });
    board.player2.active.preventDamageNextTurn = true;
    let damaged = false;
    observe(board, effect => {
      if (effect instanceof PutDamageEffect) {
        expect(effect.ignoresDefendingDamageEffects).toBe(true);
        damaged = true;
      }
    });
    useAttack(board.store, board.state, 0, 'Thunderous Edge');
    expect(damaged).toBe(true);
    expect(board.player2.active.damage).toBe(90);
  });

  it('Psychic Marionettes keeps damage modifiers while counting the opposing Bench', () => {
    const board = battle({ active: { card: 'Mega Malamar ex M6', energy: [dark, dark] } },
      { active: { card: guard }, bench: [{ card: mew }, { card: guard }] });
    observe(board, effect => { if (effect instanceof AttackEffect) effect.damage += 10; });
    useAttack(board.store, board.state, 0, 'Psychic Marionettes');
    expect(board.player2.active.damage).toBe(150);
  });

  it('Eerie Wave applies Confusion after damage', () => {
    const board = battle({ active: { card: 'Mega Malamar ex M6', energy: [dark, dark, dark] } });
    let conditions = 0;
    observe(board, effect => {
      if (effect instanceof AddSpecialConditionsEffect) {
        expect(board.player2.active.damage).toBe(200);
        conditions++;
      }
    });
    useAttack(board.store, board.state, 0, 'Eerie Wave');
    expect(conditions).toBe(1);
  });

  it('Voltaic Hammer preserves a modifier and counts only the Basic Energy actually discarded', () => {
    const board = battle({ active: { card: electivire, energy: [electric, electric, water, fire] } });
    const one = board.player1.active.energies.cards[0];
    observe(board, effect => { if (effect instanceof AttackEffect) effect.damage += 10; });
    board.overridePrompt(DiscardEnergyPromptType, () => [{ from: active, index: board.player1.active.cards.indexOf(one) }]);
    useAttack(board.store, board.state, 0, 'Voltaic Hammer');
    expect(board.player1.discard.cards).toContain(one);
    expect(board.player2.active.damage).toBe(70);
  });

  it('Zinnia transfers Energy before the switch triggers other effects', () => {
    const board = battle({ active: { card: guard, energy: [water] },
      bench: [{ card: mew }], hand: [zinnia] });
    const energy = board.player1.active.energies.cards[0];
    let appeared = false;
    observe(board, effect => {
      if (effect instanceof MovedToActiveEffect) {
        expect(board.player1.active.energies.cards).toContain(energy);
        appeared = true;
      }
    });
    board.overridePrompt('Choose cards', prompt => [(prompt as ChooseCardsPrompt).cards.cards.indexOf(energy)]);
    playTrainerCard(board.store, board.state, 0, zinnia);
    expect(appeared).toBe(true);
  });

  it('Punk Out applies with a Benched Pokémon ex and takes priority over additive retreat adjustments', () => {
    const board = battle({ active: { card: 'Wimpod M6' } }, { active: { card: 'Pawmi FLO' }, bench: [{ card: mew }] });
    const retreat = new CheckRetreatCostEffect(board.player1);
    retreat.colorlessAdjustment = 2;
    board.store.reduceEffect(board.state, retreat);
    expect(retreat.cost).toEqual([]);
  });

  it('Punk Out does not count Pokémon V', () => {
    const board = battle({ active: { card: 'Wimpod M6' } }, { active: { card: 'Lugia V SIT' } });
    const retreat = new CheckRetreatCostEffect(board.player1);
    board.store.reduceEffect(board.state, retreat);
    expect(retreat.cost).toEqual([CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS]);
  });

  it('Wishiwashi can heal 50 damage once while Active', () => {
    const board = battle({ active: { card: 'Wishiwashi ex M6', damage: 80 } });
    useAbility(board.store, board.state, 0, 'Ocean Gain');
    expect(board.player1.active.damage).toBe(30);
    expect(() => useAbility(board.store, board.state, 0, 'Ocean Gain')).toThrow();
  });

  it('Wishiwashi cannot use that healing Ability from the Bench', () => {
    const board = battle({ active: { card: guard }, bench: [{ card: 'Wishiwashi ex M6', damage: 80 }] });
    expect(() => useAbility(board.store, board.state, 0, 'Ocean Gain')).toThrow();
    expect(board.player1.bench[0].damage).toBe(80);
  });
});
