import { ensureClientCards } from '../../client/cards';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Card } from '../../game/store/card/card';
import { SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { State } from '../../game/store/state/state';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const { ASLEEP, CONFUSED, POISONED } = SpecialCondition;
const water = 'Water Energy SVE';
const psychic = 'Psychic Energy SVE';
const dark = 'Darkness Energy SVE';
const metal = 'Metal Energy SVE';
const rookidee = 'Rookidee SSH';
const unaware = 'Skeledirge SSP';

describe('Attacks that switch in a Pokémon before applying a Special Condition', () => {
  beforeAll(ensureClientCards);
  const attacks: [card: string, attack: string, energy: string, conditions: SpecialCondition[]][] = [
    ['Surskit MT', 'Sleep Inducer', 'Grass Energy SVE', [ASLEEP]],
    ['Combee DP', 'Soliciting Nectar', 'Grass Energy SVE', [ASLEEP]],
    ['Froslass GL RR', 'Sleep Inducer', water, [ASLEEP]],
    ['Muk UD', 'Sludge Drag', psychic, [CONFUSED, POISONED]],
    ['Munna BLW', 'Sleep Inducer', water, [ASLEEP]],
    ['Roselia LM', 'Flick Poison', water, [POISONED]],
  ];

  for (const [card, attack, energy, conditions] of attacks) {
    for (const position of ['active', 'bench', 'none', 'empty']) {
      it(`${card}: ${attack} with protection in ${position}`, () => {
        const g = setupGame({
          turn: 5,
          player1: { active: { card, energy: [energy] }, deck: padDeck(16) },
          player2: {
            active: { card: position === 'active' ? unaware : 'Finneon MT' },
            bench: position === 'empty' ? [] : [{ card: rookidee }, { card: position === 'bench' ? unaware : rookidee }],
            deck: padDeck(16),
          },
        });
        const oldActive = g.player2.active;
        const chosen = g.player2.bench[1];
        const targets: SpecialCondition[] = [];
        const reduce = g.store.reduceEffect.bind(g.store);
        spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
            expect(effect instanceof AddSpecialConditionsEffect).toBe(true);
            expect(effect.target).toBe(chosen);
            targets.push(...effect.specialConditions);
          }
          return reduce(state, effect);
        });
        g.overridePrompt('Choose pokemon', prompt => {
          expect(prompt.playerId).toBe(g.player1.id);
          return [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 1 }];
        });

        useAttack(g.store, g.state, 0, attack);

        const switches = position === 'active' || position === 'none';
        expect(g.player2.active).toBe(switches ? chosen : oldActive);
        expect(targets.sort()).toEqual(switches ? [...conditions].sort() : []);
        expect(oldActive.specialConditions).toEqual([]);
        expect(g.player1.active.specialConditions).toEqual([]);
        if (switches && conditions.includes(POISONED)) expect(chosen.damage).toBe(10);
        g.store.cleanup();
      });
    }
  }

  for (const choice of ['empty', 'decline', 'ordinary', 'protected-bench', 'protected-active']) {
    it(`Poison Rub applies damage then Poison to the actual defender when ${choice}`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Nidoking SW', energy: padDeck(2) }, deck: padDeck(16) },
        player2: {
          active: { card: choice === 'protected-active' ? unaware : 'Finneon MT' },
          bench: choice === 'empty' ? [] : [{ card: choice === 'protected-bench' ? unaware : rookidee }],
          deck: padDeck(16),
        },
      });
      const prior = g.player2.active;
      const switches = choice === 'ordinary' || choice === 'protected-active';
      const hit = switches ? g.player2.bench[0] : prior;
      const observed: number[] = [];
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
          expect(effect instanceof AddSpecialConditionsEffect).toBe(true);
          expect(effect.target).toBe(hit);
          observed.push(hit.damage);
        }
        return reduce(state, effect);
      });
      g.overridePrompt('Confirm', () => choice !== 'decline');
      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }]);

      useAttack(g.store, g.state, 0, 'Poison Rub');

      expect(g.player2.active).toBe(hit);
      expect(observed).toEqual([20]);
      expect(hit.specialConditions).toContain(POISONED);
      expect(hit.damage).toBe(30);
      if (switches) {
        expect(prior.damage).toBe(0);
        expect(prior.specialConditions).toEqual([]);
      }
      g.store.cleanup();
    });
  }
});

describe('Delayed attack Knock Outs', () => {
  beforeAll(ensureClientCards);
  const attacks: [card: string, attack: string, energy: string[], self: 'sleep' | 'return' | 'discard' | null][] = [
    ['Jirachi ◇ CES', 'Perish Dream', padDeck(3), 'sleep'],
    ['Jirachi Prism Star CES', 'Perish Dream', padDeck(3), 'sleep'],
    ['Jirachi ROS', 'Doom Desire', [metal, psychic], 'discard'],
    ['Jirachi LA', 'Doom Desire', [metal, metal], 'discard'],
    ['Absol G SV', 'Doom News', [dark, water, water], 'return'],
    ['Absol GRI', 'Doom News', [dark, water], 'return'],
    ['Hisuian Zoroark LOR', 'Doom Curse', [], null],
    ['Hisuian Zoroark ASR', 'Doom Curse', [], null],
    ['Galarian Slowking V CRE', 'Word of Ruin', [dark, water], null],
    ['Trevenant & Dusknoir-GX SMP', 'Pale Moon-GX', [psychic, psychic, water], null],
  ];

  for (const [card, attack, energy, self] of attacks) {
    for (const action of ['stay', 'protected', 'switch', 'evolve']) {
      it(`${card}: ${attack} resolves when the defender chooses to ${action}`, () => {
        spyOn(Math, 'random').and.returnValue(0.9);
        const g = setupGame({
          turn: 5,
          player1: { active: { card, energy }, bench: [{ card: rookidee }], deck: padDeck(16) },
          player2: {
            active: { card: action === 'protected' ? unaware : 'Charmander OBF', energy: [water] },
            bench: [{ card: rookidee }],
            hand: ['Charmeleon OBF', 'Switch SVI', 'Switch SVI'],
            deck: padDeck(16),
          },
        });
        const defendingCard = g.player2.active.getPokemonCard()!;
        const defender = g.player2.active;
        const prizes = g.player1.getPrizeLeft();
        const sleepTargets: typeof defender[] = [];
        const reduce = g.store.reduceEffect.bind(g.store);
        spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(ASLEEP)) sleepTargets.push(effect.target);
          return reduce(state, effect);
        });

        useAttack(g.store, g.state, 0, attack);
        expect(defender.getPokemonCard()).toBe(defendingCard);
        expect(g.player1.getPrizeLeft()).toBe(prizes);
        if (self === 'sleep') expect(sleepTargets).toEqual([g.player1.active]);
        if (self === 'return') expect(g.player1.hand.cards.map(card => card.fullName)).toEqual(energy);
        if (self === 'discard') expect(g.player1.discard.cards.map(card => card.fullName)).toEqual(energy);
        if (attack === 'Pale Moon-GX') {
          expect(g.player1.usedGX).toBe(true);
          expect(defender.energies.cards.length).toBe(action === 'protected' ? 1 : 0);
        }

        if (action === 'switch') {
          playTrainerCard(g.store, g.state, 1, 'Switch SVI');
          playTrainerCard(g.store, g.state, 1, 'Switch SVI');
          expect(g.player2.active).toBe(defender);
        }
        if (action === 'evolve') {
          playTrainerCard(g.store, g.state, 1, 'Charmeleon OBF');
          expect(g.player2.active.getPokemonCard()?.fullName).toBe('Charmeleon OBF');
        }
        endTurn(g.store, g.state);

        expect(g.player2.discard.cards.includes(defendingCard)).toBe(action === 'stay');
        expect(g.player1.getPrizeLeft()).toBe(action === 'stay' ? prizes - 1 : prizes);
        g.store.cleanup();
      });
    }
  }
});

describe('Delayed attack effects across copied attacks and saved boards', () => {
  beforeAll(ensureClientCards);

  it('resolves Perish Dream after the defending Pokémon Knocks Out Jirachi', () => {
    const g = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Jirachi ◇ CES', energy: padDeck(3), damage: 60 },
        bench: [{ card: rookidee }],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Charmander OBF', energy: ['Fire Energy SVE'] }, deck: padDeck(16) },
    });
    const jirachi = g.player1.active.getPokemonCard()!;
    const charmander = g.player2.active.getPokemonCard()!;

    useAttack(g.store, g.state, 0, 'Perish Dream');
    expect(g.player2.active.damage).toBe(10);
    useAttack(g.store, g.state, 1, 'Heat Tackle');

    expect(g.player1.lostzone.cards).toContain(jirachi);
    expect(g.player2.discard.cards).toContain(charmander);
    g.store.cleanup();
  });

  it('keeps the delayed Knock Out on the in-play Pokémon through Transformation Tome', () => {
    const tome = 'Transformation Tome CRI';
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Hisuian Zoroark LOR' }, deck: padDeck(16) },
      player2: {
        active: { card: 'Charmander OBF' },
        bench: [{ card: 'Finneon MT' }],
        hand: [tome, tome],
        discard: [rookidee],
        deck: padDeck(16),
      },
    });
    useAttack(g.store, g.state, 0, 'Doom Curse');
    g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
    playTrainerCard(g.store, g.state, 1, tome);
    expect(g.player2.active.getPokemonCard()?.fullName).toBe(rookidee);

    endTurn(g.store, g.state);

    expect(g.player2.discard.cards.filter(card => card.superType === SuperType.POKEMON).map(card => card.fullName))
      .toEqual(['Charmander OBF', rookidee]);
    expect(g.player2.active.getPokemonCard()?.fullName).toBe('Finneon MT');
    g.store.cleanup();
  });

  it('serializes Perish Dream with the Pokémon that copied it as the source', () => {
    const mew = 'Mew ex 30C';
    const g = setupGame({
      turn: 5,
      player1: { active: { card: mew, energy: padDeck(3) }, bench: [{ card: 'Jirachi ◇ CES' }], deck: padDeck(16) },
      player2: { active: { card: rookidee }, deck: padDeck(16) },
    });
    g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Perish Dream' }));
    useAbility(g.store, g.state, 0, 'Memory Helix');
    expect(g.player2.active.damage).toBe(10);

    const cards = new Set<Card>();
    for (const player of g.state.players) {
      for (const zone of [player.active, ...player.bench, ...player.prizes, player.deck, player.hand,
        player.discard, player.lostzone, player.stadium, player.supporter]) {
        zone.cards.forEach(card => cards.add(card));
      }
    }
    g.state.cardNames = [];
    cards.forEach(card => { card.id = g.state.cardNames.push(card.fullName) - 1; });
    const serializer = new StateSerializer();
    const restored = serializer.deserialize(serializer.serialize(g.state));
    g.store.restoreState(restored);

    const mark = restored.players[1].active.marker.markers.find(item => item.name === MarkerConstants.ATTACK_KNOCK_OUT_AT_END_OF_TURN);
    expect(mark?.source).toBe(restored.players[0].active.getPokemonCard());
    expect(mark?.source?.fullName).toBe(mew);
    endTurn(g.store, restored);

    expect(restored.players[1].discard.cards.some(card => card.fullName === rookidee)).toBe(true);
    g.store.cleanup();
  });

  it('still reads the original Perish Dream marker in an existing board', () => {
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Jirachi ◇ CES' }, deck: padDeck(16) },
      player2: { active: { card: rookidee }, deck: padDeck(16) },
    });
    g.state.activePlayer = 1;
    const jirachi = g.player1.active.getPokemonCard()!;
    g.player2.active.marker.addMarker('JIRACHI_CES_CLEAR_KNOCKOUT_MARKER', jirachi);
    g.player1.marker.addMarker('JIRACHI_CES_KNOCKOUT_MARKER', jirachi);

    endTurn(g.store, g.state);

    expect(g.player2.discard.cards.some(card => card.fullName === rookidee)).toBe(true);
    g.store.cleanup();
  });
});

describe('Independent clauses in the reviewed attacks', () => {
  beforeAll(ensureClientCards);

  it('resolves Pale Moon-GX’s delayed Knock Out without paying for the Energy discard', () => {
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Trevenant & Dusknoir-GX SMP', energy: [psychic, water] }, deck: padDeck(16) },
      player2: { active: { card: rookidee, energy: [water] }, deck: padDeck(16) },
    });
    useAttack(g.store, g.state, 0, 'Pale Moon-GX');
    expect(g.player1.usedGX).toBe(true);
    expect(g.player2.active.energies.cards.length).toBe(1);

    endTurn(g.store, g.state);

    expect(g.player2.discard.cards.map(card => card.fullName)).toContain(rookidee);
    g.store.cleanup();
  });

  it('increases Wake-Up Slap’s damage before removing the defender’s conditions', () => {
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Froslass GL RR', energy: [psychic, water] }, deck: padDeck(16) },
      player2: { active: { card: rookidee }, deck: padDeck(16) },
    });
    const target = g.player2.active;
    target.addSpecialCondition(POISONED);
    const observed: number[] = [];
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof RemoveSpecialConditionsEffect && effect.target === target) observed.push(target.damage);
      return reduce(state, effect);
    });

    useAttack(g.store, g.state, 0, 'Wake-Up Slap');

    expect(target.damage).toBe(50);
    expect(observed).toEqual([50]);
    expect(target.specialConditions).toEqual([]);
    g.store.cleanup();
  });
});
