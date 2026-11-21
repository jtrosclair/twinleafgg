import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { ChooseEnergyPrompt, ChooseEnergyPromptType } from '../../game/store/prompts/choose-energy-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, MoveCardsEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt, ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { State } from '../../game/store/state/state';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const electric = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const fighting = 'Fighting Energy SVE';
const grass = 'Grass Energy SVE';
const metal = 'Metal Energy SVE';
const psychic = 'Psychic Energy SVE';
const mew = 'Mew ex MEW';
const guard = 'Koraidon ex SVI';
const passion = "Crasher Wake's Passion FLO";
const target = (slot: SlotType, index = 0) => ({ player: PlayerType.BOTTOM_PLAYER, slot, index });

function battle(first: PlayerConfig, second: PlayerConfig = { active: { card: guard } }, defenderHP = 1000) {
  const board = setupGame({ turn: 5, player1: { deck: padDeck(10), ...first }, player2: { deck: padDeck(10), ...second } });
  board.player2.active.getPokemonCard()!.hp = defenderHP;
  return board;
}

function observe(board: ReturnType<typeof battle>, observer: (effect: Effect) => void) {
  const reduce = board.store.reduceEffect.bind(board.store);
  spyOn(board.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    observer(effect);
    return reduce(state, effect);
  });
}

describe('Aura Seeker verified card effects', () => {
  for (const [card, name, energy, count, opponent] of [
    ['Gible FLO', 'Dragon Pulse', [water, fighting], 1, false],
    ['Gabite FLO', 'Dragon Pulse', [water, fighting], 2, false],
    ['Trapinch FLO', 'Mountain Munch', [fighting, water], 1, true]
  ] as const) {
    it(`${card} discards the correct deck's top ${count} only after damage`, () => {
      const board = battle({ active: { card, energy: [...energy] } });
      const owner = opponent ? board.player2 : board.player1;
      const top = owner.deck.cards.slice(0, count);
      let moved = false;
      observe(board, effect => {
        if (!(effect instanceof MoveCardsEffect) || effect.sourceCard?.fullName !== card) return;
        expect(board.player2.active.damage).toBeGreaterThan(0);
        moved = true;
      });
      useAttack(board.store, board.state, 0, name);
      expect(moved).toBe(true);
      expect(top.every(card => owner.discard.cards.includes(card))).toBe(true);
    });
  }

  it('Quick Draw damages the defending Pokémon before drawing', () => {
    const board = battle({ active: { card: 'Pawmi FLO', energy: [electric, electric] } });
    const card = board.player1.deck.cards[0];
    observe(board, effect => {
      if (effect instanceof DealDamageEffect) expect(board.player1.deck.cards[0]).toBe(card);
    });
    useAttack(board.store, board.state, 0, 'Quick Draw');
    expect(board.player1.hand.cards).toContain(card);
  });

  for (const card of ['Hitmontop FLO', 'Medicham FLO', 'Throh FLO']) {
    it(`${card} deals its Guts Fight recoil after the outgoing damage`, () => {
      const board = battle({ active: { card, energy: [fighting, fighting, fighting] } });
      const order: string[] = [];
      observe(board, effect => {
        if (effect instanceof DealDamageEffect) order.push(effect.target === board.player1.active ? 'recoil' : 'attack');
      });
      useAttack(board.store, board.state, 0, 'Guts Fight');
      expect(order).toEqual(['attack', 'recoil']);
      expect(board.player1.active.damage).toBe(20);
    });
  }

  it('Circle Throw lets the defender choose their own replacement after damage', () => {
    const board = battle({ active: { card: 'Throh FLO', energy: [fighting] }, bench: [{ card: 'Drampa FLO' }] },
      { active: { card: guard }, bench: [{ card: mew }, { card: 'Pawmi FLO' }] });
    board.overridePrompt(ChoosePokemonPromptType, prompt => {
      expect(prompt.playerId).toBe(board.player2.id);
      expect((prompt as ChoosePokemonPrompt).playerType).toBe(PlayerType.BOTTOM_PLAYER);
      expect(board.player2.active.damage).toBe(20);
      return [target(SlotType.BENCH, 1)];
    });
    useAttack(board.store, board.state, 0, 'Circle Throw');
    expect(board.player2.active.getPokemonCard()!.fullName).toBe('Pawmi FLO');
  });

  it('Circle Throw cannot switch the original defender through attack-effect protection', () => {
    const board = battle({ active: { card: 'Throh FLO', energy: [fighting] } },
      { active: { card: guard }, bench: [{ card: mew }] });
    board.player2.active.preventEffectsOfAttacksNextTurn = true;
    useAttack(board.store, board.state, 0, 'Circle Throw');
    expect(board.player2.active.getPokemonCard()!.fullName).toBe(guard);
    expect(board.player2.active.damage).toBe(20);
  });

  it('Welcoming Song offers only the open Bench slots', () => {
    const board = battle({ active: { card: 'Meloetta FLO', energy: [water] },
      bench: Array.from({ length: 4 }, () => ({ card: mew })), deck: [mew, mew, ...padDeck(8)] });
    board.overridePrompt('Choose cards', prompt => {
      expect((prompt as ChooseCardsPrompt).options.max).toBe(1);
      return [0];
    });
    useAttack(board.store, board.state, 0, 'Welcoming Song');
    expect(board.player1.getPokemonInPlay().length).toBe(6);
  });

  it('Perplex applies Confusion after its 30 damage', () => {
    const board = battle({ active: { card: 'Meloetta FLO', energy: [psychic, water] } }, { active: { card: mew } });
    let confused = false;
    observe(board, effect => {
      if (!(effect instanceof AddSpecialConditionsEffect)) return;
      expect(board.player2.active.damage).toBe(30);
      confused = true;
    });
    useAttack(board.store, board.state, 0, 'Perplex');
    expect(confused).toBe(true);
  });

  it('Welcoming Dance still shows the opposing hand when their Bench is full', () => {
    const board = battle({ active: { card: 'Oricorio FLO', energy: [electric] } },
      { active: { card: guard }, bench: Array.from({ length: 5 }, () => ({ card: mew })), hand: [mew, water] });
    let revealed = false;
    board.overridePrompt('Show cards', prompt => {
      expect(prompt.playerId).toBe(board.player1.id);
      expect((prompt as ShowCardsPrompt).cards).toEqual(board.player2.hand.cards);
      revealed = true;
      return true;
    });
    useAttack(board.store, board.state, 0, 'Welcoming Dance');
    expect(revealed).toBe(true);
    expect(board.player2.bench.every(slot => slot.getPokemonCard())).toBe(true);
  });

  it('Powerful Breath attaches Basic Energy after damage and shuffles', () => {
    const board = battle({ active: { card: 'Drampa FLO', energy: [fighting] },
      bench: [{ card: mew }], deck: [water, ...padDeck(9)] });
    const selected = board.player1.deck.cards[0];
    let shuffled = false;
    board.overridePrompt(AttachEnergyPromptType, () => {
      expect(board.player2.active.damage).toBe(30);
      return [{ index: 0, to: target(SlotType.ACTIVE) }];
    });
    board.overridePrompt('Shuffle deck', () => {
      shuffled = true;
      return board.player1.deck.cards.map((_, index) => index);
    });
    useAttack(board.store, board.state, 0, 'Powerful Breath');
    expect(board.player1.active.energies.cards).toContain(selected);
    expect(shuffled).toBe(true);
  });

  for (const [energies, selection, remaining] of [
    [[electric, water, fighting], [0, 1], 1],
    [['Double Turbo Energy BRS', fighting], [0], 1]
  ] as const) {
    it(`Desert Wind returns two Energy units after damage using ${selection.length} selected cards`, () => {
      const board = battle({ active: { card: 'Flygon FLO', energy: [grass, fighting] } },
        { active: { card: guard, energy: [...energies] } });
      const list = board.player2.active;
      const selected = selection.map(index => list.energies.cards[index]);
      let prompted = false;
      board.overridePrompt(ChooseEnergyPromptType, prompt => {
        expect(board.player2.active.damage).toBe(90);
        expect((prompt as ChooseEnergyPrompt).cost.length).toBe(2);
        prompted = true;
        return [...selection];
      });
      useAttack(board.store, board.state, 0, 'Desert Wind');
      expect(prompted).toBe(true);
      expect(list.energies.cards.length).toBe(remaining);
      expect(selected.every(card => board.player2.deck.cards.includes(card))).toBe(true);
    });
  }

  it('Fight Arena heals the user’s non-Rule-Box Pokémon and leaves all other Pokémon alone', () => {
    const board = battle({ active: { card: mew, damage: 40 },
      bench: [{ card: 'Pawmi FLO', damage: 30 }, { card: 'Mawile FLO', damage: 10 }] },
    { active: { card: 'Pawmi FLO', damage: 40 } });
    board.player1.stadium.cards.push(getCardByName('Fight Arena FLO'));
    board.store.dispatch(new UseStadiumAction(board.player1.id));
    expect([board.player1.active.damage, board.player1.bench[0].damage, board.player1.bench[1].damage]).toEqual([40, 10, 0]);
    expect(board.player2.active.damage).toBe(40);
  });

  it('Fight Arena cannot be used when only Rule Box Pokémon can be healed', () => {
    const board = battle({ active: { card: mew, damage: 40 }, bench: [{ card: 'Pawmi FLO' }] });
    board.player1.stadium.cards.push(getCardByName('Fight Arena FLO'));
    expect(() => board.store.dispatch(new UseStadiumAction(board.player1.id))).toThrow();
    expect(board.player1.stadiumUsedTurn).toBe(0);
  });

  it('Power Cyclone uses the actual Pokémon and Energy when copied with Genome Hacking', () => {
    const board = battle({ active: { card: mew, energy: [water, water, water] }, bench: [{ card: 'Drampa FLO' }] },
      { active: { card: 'Sigilyph ex FLO' } });
    const energy = board.player1.active.energies.cards[0];
    board.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Power Cyclone' }));
    board.overridePrompt(AttachEnergyPromptType, () => {
      expect(board.player2.active.damage).toBe(140);
      return [{ index: board.player1.active.cards.indexOf(energy), to: target(SlotType.BENCH) }];
    });
    useAttack(board.store, board.state, 0, 'Genome Hacking');
    expect(board.player1.bench[0].energies.cards).toContain(energy);
  });

  it('Sonic Edge bypasses Mega Protection and still uses normal attack damage attribution', () => {
    const board = battle({ active: { card: 'Mega Garchomp Z ex FLO', energy: [water, fighting, water] } },
      { active: { card: 'Sigilyph ex FLO' } });
    let normalDamage = false;
    observe(board, effect => {
      if (effect instanceof PutDamageEffect && effect.target === board.player2.active) {
        expect(effect.ignoresDefendingDamageEffects).toBe(true);
        normalDamage = true;
      }
    });
    useAttack(board.store, board.state, 0, 'Sonic Edge');
    expect(board.player2.active.damage).toBe(240);
    expect(normalDamage).toBe(true);
  });

  for (const [card, name, energy, expected] of [
    ['Mega Garchomp Z ex FLO', 'Dragon Avenger', [water, fighting], 40],
    ['Mawile FLO', 'Big Jaw', [metal, metal, metal], 70]
  ] as const) {
    it(`${name} preserves modifiers when calculating its printed multiplier`, () => {
      const board = battle({ active: { card, energy: [...energy] }, discard: ['Drampa FLO', mew, water] },
        { active: { card: guard }, hand: [mew, water] });
      observe(board, effect => { if (effect instanceof AttackEffect && effect.attack.name === name) effect.damage += 10; });
      useAttack(board.store, board.state, 0, name);
      expect(board.player2.active.damage).toBe(expected);
    });
  }

  it('Korrina’s Determination boosts a canonical Mega Evolution ex for each Prize already taken', () => {
    const korrina = "Korrina's Determination FLO";
    const board = battle({ active: { card: 'Mega Lucario Z ex FLO', energy: [metal, metal] }, hand: [korrina] },
      { active: { card: 'Pawmi FLO' } });
    board.player2.prizesTaken = 2;
    playTrainerCard(board.store, board.state, 0, korrina);
    useAttack(board.store, board.state, 0, 'Dancing Fist');
    expect(board.player2.active.damage).toBe(160);
  });

  it('Crasher Wake’s Passion shuffles the entire Water evolution stack and attachments', () => {
    const board = battle({ active: { card: mew },
      bench: [{ card: 'Quagsire FLO', energy: [water], tools: ['Bravery Charm PAL'] }],
      hand: [passion] });
    board.player1.bench[0].cards.unshift(getCardByName('Wooper FLO'));
    const cards = [...board.player1.bench[0].cards];
    playTrainerCard(board.store, board.state, 0, passion);
    expect(board.player1.bench[0].cards).toEqual([]);
    expect(cards.every(card => board.player1.deck.cards.includes(card))).toBe(true);
  });

  it('Double Strike uses the newly promoted defender for the second attack', () => {
    const board = battle({ active: { card: 'Pawmot FLO', energy: [electric, electric] } },
      { active: { card: 'Pawmi FLO' }, bench: [{ card: guard }] }, 50);
    board.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Mach Bolt' }));
    useAttack(board.store, board.state, 0, 'Mach Bolt');
    expect(board.player2.active.getPokemonCard()!.fullName).toBe(guard);
    expect(board.player2.active.damage).toBe(100);
  });

  it('Double Strike is suppressed on the first attack when its Ability is blocked', () => {
    const board = battle({ active: { card: 'Pawmot FLO', energy: [electric, electric] } });
    observe(board, effect => {
      if (effect instanceof PowerEffect && effect.card === board.player1.active.getPokemonCard()) {
        throw new Error('Double Strike is suppressed');
      }
    });
    board.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Mach Bolt' }));
    useAttack(board.store, board.state, 0, 'Mach Bolt');
    expect(board.player2.active.damage).toBe(100);
  });
});
