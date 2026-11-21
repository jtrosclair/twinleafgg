import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const fire = 'Fire Energy SVE';
const fighting = 'Fighting Energy SVE';
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const dark = 'Darkness Energy SVE';
const grass = 'Grass Energy SVE';
const metal = 'Metal Energy SVE';
const mew = 'Mew ex MEW';
const clefable = 'Mega Clefable ex M3';
const drampa = 'Drampa FLO';

function battle(first: PlayerConfig, second: PlayerConfig = { active: { card: drampa } }) {
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

describe('Remaining modern Ability attribution', () => {
  for (const card of ['Dusclops SFA', 'Dusknoir SFA']) {
    it(`${card} still self-knocks out when Wings of Light prevents Cursed Blast counters`, () => {
      const board = battle({ active: { card: drampa }, bench: [{ card }] }, { active: { card: clefable } });
      const source = board.player1.bench[0].getPokemonCard()!;
      board.overridePrompt(ChoosePokemonPromptType, () => [{ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
      useAbility(board.store, board.state, 0, 'Cursed Blast');
      expect(board.player2.active.damage).toBe(0);
      expect(board.player1.discard.cards).toContain(source);
      expect(board.player2.getPrizeLeft()).toBe(5);
    });
  }

  for (const [card, attack, energy, damage] of [
    [clefable, 'Shooting Moon', [psychic, psychic], 0],
    [drampa, 'Powerful Breath', [fighting], 30]
  ] as const) {
    it(`Counterattack Quills resolves against ${card} with its actual Ability source`, () => {
      const board = battle({ active: { card, energy: [...energy] } },
        { active: { card: 'Sandslash M6' }, bench: [{ card: mew }] });
      useAttack(board.store, board.state, 0, attack);
      expect(board.player1.active.damage).toBe(damage);
    });
  }

  for (const prevented of [false, true]) {
    it(`Shooting Moon counts Energy moved from the hand, discard prevented: ${prevented}`, () => {
      const board = battle({ active: { card: clefable, energy: [psychic, psychic] }, hand: [fire] });
      const selected = board.player1.hand.cards[0];
      observe(board, effect => {
        if (effect instanceof MoveCardsEffect && effect.source === board.player1.hand && effect.cards?.includes(selected)) {
          effect.preventDefault = prevented;
        }
      });
      board.overridePrompt('Choose cards', () => [0]);
      useAttack(board.store, board.state, 0, 'Shooting Moon');
      expect(board.player2.active.damage).toBe(prevented ? 120 : 160);
      expect(board.player1.hand.cards.includes(selected)).toBe(prevented);
    });
  }

  it('Nightmare deals damage before applying Sleep', () => {
    const board = battle({ active: { card: 'Gengar PAF', energy: [dark, water] } });
    let applied = false;
    observe(board, effect => {
      if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.ASLEEP)) {
        expect(board.player2.active.damage).toBe(100);
        applied = true;
      }
    });
    useAttack(board.store, board.state, 0, 'Nightmare');
    expect(applied).toBe(true);
  });

  it('Digging Claw discards the top card of the opposing deck after damage', () => {
    const board = battle({ active: { card: 'Sandslash M6', energy: [fighting] } });
    const top = board.player2.deck.cards[0];
    observe(board, effect => {
      if (effect instanceof MoveCardsEffect && effect.source === board.player2.deck && effect.destination === board.player2.discard) {
        expect(board.player2.active.damage).toBe(60);
      }
    });
    useAttack(board.store, board.state, 0, 'Digging Claw');
    expect(board.player2.discard.cards).toContain(top);
  });

  for (const [card, name, energy, expected, bench] of [
    ["Lillie's Clefairy ex JTG", 'Full Moon Rondo', [psychic, water], 70, true],
    ['Mega Chandelure ex M5', 'Phantom Maze', [psychic, psychic], 290, false],
    ['Pecharunt ex SFA', 'Irritated Outburst', [dark, dark], 130, false],
    ['Cradily SCR', 'Miasma Wind', [grass], 110, false],
    ['Heatran TWM', 'Steel Burst', [metal, water, water], 60, false],
  ] as const) {
    it(`${name} keeps the prior damage modifier while applying its printed calculation`, () => {
      const board = battle({ active: { card, energy: [...energy] }, bench: bench ? [{ card: mew }] : [] },
        { active: { card: drampa }, bench: bench ? [{ card: mew }] : [] });
      board.player2.prizesTaken = 2;
      board.player2.active.specialConditions = [SpecialCondition.ASLEEP];
      let recorded = 0;
      observe(board, effect => {
        if (effect instanceof AttackEffect && effect.attack.name === name) effect.damage += 10;
        if (effect instanceof DealDamageEffect && effect.attack.name === name) recorded = effect.damage;
      });
      useAttack(board.store, board.state, 0, name);
      expect(recorded).toBe(expected);
    });
  }
});
