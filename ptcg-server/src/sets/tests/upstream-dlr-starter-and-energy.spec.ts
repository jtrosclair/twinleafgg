import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, AfterAttachEnergyEffect, CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { endTurn, useAbility, useAttack } from './card-test-helpers';
import { padDeck, PlayerConfig, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const water = 'Water Energy SVE';
const dark = 'Darkness Energy SVE';
const lightning = 'Lightning Energy SVE';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };

function battle(player1: PlayerConfig, player2: PlayerConfig = { active: { card: mew } }) {
  const board = setupGame({ turn: 5, player1: { deck: padDeck(10), ...player1 }, player2: { deck: padDeck(10), ...player2 } });
  board.player2.active.getPokemonCard()!.hp = 1000;
  return board;
}

function observe(board: ReturnType<typeof battle>, check: (effect: Effect) => void) {
  const reduce = board.store.reduceEffect.bind(board.store);
  spyOn(board.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    check(effect);
    return reduce(state, effect);
  });
}

describe('Delta Reign starter-deck effects', () => {
  for (const [card, name, target] of [
    ['Morpeko MEZ', 'Call for Family', mew], ['Electabuzz M6', 'Call for Family', mew], ['Surskit M6', 'Multiply', 'Surskit M6'],
  ] as const) {
    for (const openings of [0, 1]) {
      it(`${card} limits its private search to ${openings} open Bench slots and shuffles`, () => {
        const board = battle({ active: { card, energy: [water] },
          bench: Array.from({ length: 5 - openings }, () => ({ card: mew })), deck: [target, target, ...padDeck(8)] });
        let prompts = 0;
        let shuffles = 0;
        board.overridePrompt('Choose cards', prompt => {
          prompts++;
          expect((prompt as ChooseCardsPrompt).options.max).toBe(openings);
          expect((prompt as ChooseCardsPrompt).options.min).toBe(0);
          return [0];
        });
        board.overridePrompt('Shuffle deck', () => { shuffles++; return board.player1.deck.cards.map((_, i) => i); });
        useAttack(board.store, board.state, 0, name);
        expect(prompts).toBe(openings);
        expect(shuffles).toBe(1);
        expect(board.player1.bench.filter(slot => slot.getPokemonCard()).length).toBe(5);
      });
    }
  }

  for (const [card, attack, energy, searched, usePower] of [
    ['Darkrai MEZ', 'Shadow-Clad', dark, dark, false],
    ['Raikou ex M6', 'Thunder-Clad', lightning, 'Double Turbo Energy BRS', false],
    ['Pawmot MEE', "Generator's Touch", lightning, lightning, true],
  ] as const) {
    it(`${attack} checks attachment legality before moving the Energy`, () => {
      const board = battle({ active: { card, energy: [energy] },
        deck: usePower ? padDeck(10) : [searched, ...padDeck(9)], discard: usePower ? [searched] : [] });
      const pile = usePower ? board.player1.discard : board.player1.deck;
      const selected = pile.cards[0];
      let attachments = 0;
      observe(board, effect => {
        if (effect instanceof AttachEnergyEffect && effect.energyCard === selected) {
          expect(pile.cards).toContain(selected);
          expect(effect.sourceZone).toBe(usePower ? 'discard' : 'deck');
          attachments++;
          effect.preventDefault = true;
        }
      });
      board.overridePrompt(AttachEnergyPromptType, () => [{ index: 0, to: active }]);
      if (usePower) useAbility(board.store, board.state, 0, attack);
      else useAttack(board.store, board.state, 0, attack);
      expect(attachments).toBe(1);
      expect(pile.cards).toContain(selected);
      expect(board.player1.active.cards).not.toContain(selected);
    });
  }

  it('Thunder-Clad attaches a Special Energy before shuffling and resolving attachment reactions', () => {
    const board = battle({ active: { card: 'Raikou ex M6', energy: [lightning] }, deck: ['Double Turbo Energy BRS', ...padDeck(9)] });
    const selected = board.player1.deck.cards[0];
    const order: string[] = [];
    observe(board, effect => {
      if (effect instanceof AttachEnergyEffect && effect.energyCard === selected) order.push('attach');
      if (effect instanceof AfterAttachEnergyEffect && effect.energyCard === selected) order.push('react');
    });
    board.overridePrompt(AttachEnergyPromptType, () => [{ index: 0, to: active }]);
    board.overridePrompt('Shuffle deck', () => { order.push('shuffle'); return board.player1.deck.cards.map((_, i) => i); });
    useAttack(board.store, board.state, 0, 'Thunder-Clad');
    expect(order).toEqual(['attach', 'shuffle', 'react']);
    expect(board.player1.active.energies.cards).toContain(selected);
  });

  it('Power Rush flips after damage and prevents all attacks next turn on tails', () => {
    const board = battle({ active: { card: 'Raikou ex M6', energy: [lightning, lightning, water] } },
      { active: { card: 'Koraidon ex SVI' } });
    let flips = 0;
    observe(board, effect => {
      if (effect instanceof CoinFlipEffect) {
        expect(board.player2.active.damage).toBe(200);
        effect.forcedResult = false;
        flips++;
      }
    });
    useAttack(board.store, board.state, 0, 'Power Rush');
    endTurn(board.store, board.store.state);
    expect(flips).toBe(1);
    expect(board.player1.active.cannotAttackNextTurn).toBe(true);
  });

  for (const [card, name, damage, priorDamage, bench] of [
    ['Zoroark ex MEZ', 'Riotous Beating', 50, 0, 1], ['Liepard MEZ', 'Follow-Up Claw', 70, 30, 0],
  ] as const) {
    it(`${name} preserves an attack damage bonus calculated before the card handler`, () => {
      const board = battle({ active: { card, energy: [dark] }, bench: bench ? [{ card: mew }] : [] },
        { active: { card: 'Koraidon ex SVI', damage: priorDamage } });
      observe(board, effect => { if (effect instanceof AttackEffect && effect.attack.name === name) effect.damage += 10; });
      useAttack(board.store, board.state, 0, name);
      expect(board.player2.active.damage - priorDamage).toBe(damage);
    });
  }

  for (const [card, name, energy, damage] of [
    ['Miraidon MEE', 'Flashing Bolt', [lightning, lightning, water], 120],
    ['Zoroark ex MEZ', 'Slashing Strike', [dark, water, water], 210],
  ] as const) {
    it(`${name} locks the printed attack for one turn`, () => {
      const board = battle({ active: { card, energy: [...energy] } }, { active: { card: 'Koraidon ex SVI' } });
      useAttack(board.store, board.state, 0, name);
      endTurn(board.store, board.store.state);
      expect(board.player1.active.cannotUseAttacksNextTurn).toEqual([name]);
      expect(board.player2.active.damage).toBe(damage);
      endTurn(board.store, board.store.state);
      endTurn(board.store, board.store.state);
      expect(board.player1.active.cannotUseAttacksNextTurn).toEqual([]);
      useAttack(board.store, board.store.state, 0, name);
      expect(board.player2.active.damage).toBe(damage * 2);
    });

    it(`Genome Hacking can copy ${name} again next turn`, () => {
      const board = battle({ active: { card: mew, energy: [water, water, water] } }, { active: { card } });
      const copy = () => {
        board.overridePrompt('Choose attack', () => ({ index: 0, attack: name }));
        useAttack(board.store, board.store.state, 0, 'Genome Hacking');
      };
      copy();
      endTurn(board.store, board.store.state);
      copy();
      expect(board.player2.active.damage).toBe(damage * 2);
    });
  }
});
