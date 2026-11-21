import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ensureClientCards } from '../../client/cards';
import { CardTag, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Next print and payment audit', () => {
  beforeAll(ensureClientCards);

  it('waits for the optional Lightning discard and deals damage before Paralysis', () => {
    const lightning = 'Lightning Energy SVE';
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Bellibolt ex PAL', energy: [lightning, lightning, 'Water Energy SVE'] }, deck: padDeck(16) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(16) },
    });
    const target = g.player2.active;
    target.getPokemonCard()!.hp = 999;
    target.getPokemonCard()!.weakness = [];
    const applied: unknown[] = [];
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
        applied.push([effect instanceof AddSpecialConditionsEffect, target.damage, g.player1.discard.cards.length]);
      }
      return reduce(state, effect);
    });
    g.overridePrompt('Choose energy', () => [0, 1]);
    useAttack(g.store, g.state, 0, 'Paralyzing Bolt');
    expect(applied).toEqual([[true, 160, 2]]);
    expect(target.specialConditions).toContain(SpecialCondition.PARALYZED);
    g.store.cleanup();
  });

  it('has no Poison Experiment bonus if its selected Energy is prevented from being discarded', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Cacturne PL', energy: ['Grass Energy SVE', 'Darkness Energy SVE'] }, deck: padDeck(16) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(16) },
    });
    let attempted = false;
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof DiscardCardsEffect && effect.target === g.player1.active) {
        attempted = true;
        effect.preventDefault = true;
        return state;
      }
      return reduce(state, effect);
    });
    g.overridePrompt('Choose cards', prompt => [(prompt as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === 'Grass Energy SVE')]);
    useAttack(g.store, g.state, 0, 'Poison Experiment');
    expect(attempted).toBe(true);
    expect(g.player2.active.damage).toBe(20);
    expect(g.player2.active.specialConditions).toEqual([]);
    g.store.cleanup();
  });

  it('lets the opponent choose whether to discard after taking Ice Bind damage', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Walrein MT', energy: padDeck(3) }, deck: padDeck(16) },
      player2: { active: { card: 'Finneon MT' }, hand: ['Water Energy SVE'], deck: padDeck(16) },
    });
    const target = g.player2.active;
    target.getPokemonCard()!.hp = 300;
    g.overridePrompt('Confirm', prompt => {
      expect(prompt.playerId).toBe(g.player2.id);
      expect(target.damage).toBe(70);
      return false;
    });
    useAttack(g.store, g.state, 0, 'Ice Bind');
    expect(target.damage).toBe(70);
    expect(target.specialConditions).toContain(SpecialCondition.PARALYZED);
    g.store.cleanup();
  });

  it('checks the defender’s remaining HP once Leaf Hurricane has dealt 60 damage', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Wormadam Plant Cloak SW', energy: ['Grass Energy SVE', ...padDeck(2)] }, deck: padDeck(16) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(16) },
    });
    const target = g.player2.active;
    target.getPokemonCard()!.hp = 100;
    target.getPokemonCard()!.weakness = [];
    useAttack(g.store, g.state, 0, 'Leaf Hurricane');
    expect(target.damage).toBe(60);
    expect(target.specialConditions).toContain(SpecialCondition.CONFUSED);
    g.store.cleanup();
  });
});

const { ASLEEP, BURNED, CONFUSED, PARALYZED, POISONED } = SpecialCondition;
const water = 'Water Energy SVE';

interface AttackSetup {
  exDefender?: boolean;
  tails?: boolean;
  confirm?: boolean;
  selfDiscard?: number;
  stack?: string[];
  recent?: boolean;
  bench?: string[];
  switch?: boolean;
  selfDamage?: number;
  endDamage?: number;
  rest?: [before: number, after: number];
  defenderEnergy?: string[];
  poison?: number;
  tool?: string;
}

type PrintedAttack = [
  card: string, attack: string, energy: string[], damage: number,
  targetConditions: SpecialCondition[], selfConditions: SpecialCondition[], setup?: AttackSetup
];

const attacks: PrintedAttack[] = [
  ["Nidoqueen PLF", "Poison Horn", ["Psychic Energy SVE", water], 50, [POISONED], []],
  ["Shelder DF", "Shell Grab", ["Fighting Energy SVE"], 10, [PARALYZED], []],
  ["Horsea DF", "Sleepy Ball", ["Water Energy SVE"], 10, [ASLEEP], []],
  ["Bayleef DF", "Poisonpowder", ["Fighting Energy SVE", "Water Energy SVE"], 20, [POISONED], []],
  ["Kirlia DF", "Flickering Flames", ["Fire Energy SVE", "Water Energy SVE"], 20, [ASLEEP], []],
  ["Chikorita DF", "Sleep Powder", ["Water Energy SVE"], 0, [ASLEEP], []],
  ["Vibrava DF 42", "Sonic Noise", ["Psychic Energy SVE", "Water Energy SVE"], 30, [CONFUSED], [], {exDefender: true}],
  ["Vibrava DF 42", "Sonic Noise", ["Psychic Energy SVE", "Water Energy SVE"], 30, [], []],
  ["Gyarados BS", "Bubble Beam", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 40, [PARALYZED], []],
  ["Gyarados MT", "Enrage", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [], [CONFUSED], {tails: true}],
  ["Larvitar MT", "Mountain Bite", ["Fighting Energy SVE"], 20, [], [ASLEEP], {confirm: true, selfDiscard: 1}],
  ["Larvitar MT", "Mountain Bite", ["Fighting Energy SVE"], 10, [], [], {confirm: false}],
  ["Parasect MT", "Wild Spores", ["Grass Energy SVE"], 40, [ASLEEP, POISONED], [], {stack: ["Paras MT"], recent: true}],
  ["Parasect MT", "Wild Spores", ["Grass Energy SVE"], 20, [], [], {stack: ["Paras MT"]}],
  ["Parasect MT", "Wild Spores", ["Grass Energy SVE"], 20, [], [], {recent: true}],
  ["Uxie MT", "Mind Off", ["Psychic Energy SVE"], 30, [ASLEEP], [], {bench: ["Mesprit MT", "Azelf MT"]}],
  ["Uxie MT", "Mind Off", ["Psychic Energy SVE"], 10, [], [], {bench: ["Mesprit MT"]}],
  ["Skorupi M3", "Poison Jab", ["Darkness Energy SVE", "Darkness Energy SVE"], 20, [POISONED], []],
  ["Meowstic M3", "Perplex", ["Psychic Energy SVE"], 0, [CONFUSED], []],
  ["Salazzle ex M3", "Fatal Nail", ["Fire Energy SVE", "Fire Energy SVE"], 100, [BURNED, POISONED], [], {switch: true}],
  ["Drapion M3", "Hazard Tail", ["Darkness Energy SVE", "Darkness Energy SVE", "Darkness Energy SVE"], 100, [PARALYZED, POISONED], [], {endDamage: 70}],
  ["Amaura M3", "Icy Wind", ["Water Energy SVE", "Water Energy SVE"], 50, [ASLEEP], []],
  ["Dedenne M3", "Thunder Shock", ["Lightning Energy SVE", "Water Energy SVE"], 30, [PARALYZED], []],
  ["Beautifly M2a", "Stun Spore", ["Grass Energy SVE"], 40, [PARALYZED], []],
  ["Mega Froslass ex M2a", "Absolute Snow", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 150, [ASLEEP], []],
  ["Abomasnow SF", "Below Zero", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [PARALYZED], [], {stack: ["Snover SF"], recent: true}],
  ["Abomasnow SF", "Below Zero", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [], {stack: ["Snover SF"]}],
  ["Treecko CG 68", "Shining Claws", ["Psychic Energy SVE"], 10, [CONFUSED], []],
  ["Omastar HP", "Bind", ["Psychic Energy SVE", "Water Energy SVE"], 30, [PARALYZED], []],
  ["Bibarel XY", "Hypno Headbutt", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 90, [], [ASLEEP], {confirm: true}],
  ["Bibarel XY", "Hypno Headbutt", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [], {confirm: false}],
  ["Snorlax DP", "Ease Up", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 70, [], [ASLEEP], {stack: ["Munchlax DP"]}],
  ["Snorlax DP", "Ease Up", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 40, [], [ASLEEP]],
  ["Azumarill DP", "Bubble Pump", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [PARALYZED], [], {stack: ["Azurill DP", "Marill DP"]}],
  ["Azumarill DP", "Bubble Pump", ["Water Energy SVE", "Water Energy SVE"], 40, [PARALYZED], [], {stack: ["Azurill DP", "Marill DP"]}],
  ["Azumarill DP", "Bubble Pump", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [], {stack: ["Marill DP"]}],
  ["Purugly G PL", "Poor Sleep", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [], [ASLEEP]],
  ["Purugly G PL", "Poor Sleep", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 50, [], [], {tails: true}],
  ["Arcanine RR", "Burn Out", ["Fire Energy SVE", "Water Energy SVE"], 60, [], [BURNED], {confirm: true}],
  ["Arcanine RR", "Burn Out", ["Fire Energy SVE", "Water Energy SVE"], 30, [], [], {confirm: false}],
  ["Buneary LA", "Rest", ["Water Energy SVE"], 0, [], [ASLEEP], {rest: [50, 10]}],
  ["Munchlax RR", "Rest", ["Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {rest: [60, 0]}],
  ["Weezing RR", "Damage Breakdown", ["Water Energy SVE"], 30, [], [CONFUSED], {selfDamage: 30}],
  ["Kakuna RR", "Dangerous Evolution", ["Grass Energy SVE"], 0, [POISONED], [], {tails: true}],
  ["Shedinja LA", "Curse and Deceive", ["Water Energy SVE"], 30, [CONFUSED], [], {selfDamage: 10}],
  ["Shedinja LA", "Curse and Deceive", ["Water Energy SVE"], 30, [], []],
  ["Tentacruel LA", "Dangerous Poison", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [PARALYZED, POISONED], [], {defenderEnergy: ["Water Energy SVE", "Water Energy SVE", "Double Colorless Energy BS"]}],
  ["Tentacruel LA", "Dangerous Poison", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [], {defenderEnergy: ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"]}],
  ["Porygon RG", "Confuse Ray", ["Water Energy SVE", "Water Energy SVE"], 10, [CONFUSED], []],
  ["Squirtle RG", "Bubble", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Voltorb RG", "Thundershock", ["Lightning Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Nidoqueen RG", "Toxic", ["Grass Energy SVE"], 0, [POISONED], [], {poison: 20}],
  ["Venusaur ex RG", "Pollen Hazard", ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 20, [POISONED, BURNED, CONFUSED], []],
  ["Exeggcute RG", "Psybeam", ["Psychic Energy SVE"], 10, [CONFUSED], []],
  ["Bulbasaur RG", "Sleep Poison", ["Water Energy SVE"], 0, [ASLEEP, POISONED], []],
  ["Bulbasaur RG", "Sleep Poison", ["Water Energy SVE"], 0, [], [], {tails: true}],
  ["Porygon2 DS", "Machine Burst", ["Water Energy SVE", "Water Energy SVE"], 30, [ASLEEP, BURNED], [], {tool: "Technical Machine TS-1 LA"}],
  ["Porygon2 DS", "Machine Burst", ["Water Energy SVE", "Water Energy SVE"], 30, [], []],
  ["Dratini DS 66", "Thunder Wave", ["Lightning Energy SVE"], 10, [PARALYZED], []],
  ["Zubat DS", "Poison Fang", ["Grass Energy SVE"], 10, [POISONED], []],
  ["Shelgon DS 53", "Tight Jaw", ["Fire Energy SVE"], 10, [PARALYZED], []],
  ["Electabuzz EVO", "Thundershock", ["Lightning Energy SVE"], 10, [PARALYZED], []],
  ["Jynx ex MEW", "Icy Wind", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 120, [ASLEEP], []],
  ["Joltik BLW", "Thunder Wave", ["Lightning Energy SVE"], 10, [PARALYZED], []],
  ["Pikachu LM", "Thunder Wave", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Girafarig LM", "Disorder", ["Psychic Energy SVE", "Water Energy SVE"], 20, [CONFUSED], [], {defenderEnergy: ["Double Colorless Energy BS"]}],
  ["Girafarig LM", "Disorder", ["Psychic Energy SVE", "Water Energy SVE"], 20, [], []],
  ["Voltorb LM", "Thunderwave", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Team Rocket's Persian ex DRI", "Slash and Cash", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 140, [CONFUSED], []],
  ["Team Rocket's Ekans DRI", "Hold Back", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Porygon-Z TM", "Suspicious Beam Beta", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [], [CONFUSED], {endDamage: 20}],
  ["Porygon-Z TM", "Suspicious Beam Beta", ["Water Energy SVE", "Water Energy SVE", "Rainbow Energy TR"], 80, [], [], {endDamage: 0}],
  ["Slakoth DRX", "Smack 'n' Slack", ["Water Energy SVE"], 10, [], [ASLEEP]],
  ["Dunsparce SS", "Sudden Flash", ["Water Energy SVE"], 10, [PARALYZED], []],
  ["Natu SS", "Soothing Wave", ["Psychic Energy SVE"], 0, [ASLEEP], []],
  ["Foongus SV11B", "Poison Spore", ["Water Energy SVE"], 0, [POISONED], []],
  ["Snorlax PR", "Roll Over", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 30, [ASLEEP], [ASLEEP]],
  ["Snorlax PR", "Roll Over", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 30, [], [ASLEEP], {tails: true}],
  ["Wailmer RS", "Rest", ["Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {rest: [45, 5]}],
  ["Kirlia RS 35", "Dazzle Dance", ["Water Energy SVE"], 0, [CONFUSED], []],
  ["Wailord GE", "Sink Deep", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [ASLEEP], {selfDamage: 10}],
  ["Wailord GE", "Sink Deep", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], []],
  ["Slowpoke GE", "Rest", ["Water Energy SVE"], 0, [], [ASLEEP], {rest: [50, 20]}],
  ["Slowbro HS", "Big Yawn", ["Water Energy SVE"], 30, [ASLEEP], [ASLEEP]],
  ["Dark Pupitar TRR", "Dark Streak", ["Water Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Dratini TRR", "Dragon Song", ["Water Energy SVE"], 0, [ASLEEP], []],
  ["Wailord SV", "Rest", ["Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {rest: [50, 10]}],
];

describe('Printed damage, cost, and status conditions', () => {
  beforeAll(ensureClientCards);

  for (const [card, attack, energy, damage, targetConditions, selfConditions, setup = {}] of attacks) {
    for (const shield of [false, true]) {
      it(`${card}: ${attack} with ${energy.join(', ')} and ${JSON.stringify(setup)} ${shield ? 'against' : 'without'} Elegant Swim`, () => {
        const random = spyOn(Math, 'random').and.returnValue(shield ? 0.1 : 0.9);
        const g = setupGame({
          turn: 5,
          player1: {
            active: { card, energy },
            bench: (setup.bench ?? ['Rookidee SSH']).map(card => ({ card })),
            deck: padDeck(16),
          },
          player2: {
            active: { card: 'Finneon MT', energy: [water, ...(setup.defenderEnergy ?? []), ...(setup.bench?.includes('Azelf MT') ? [water] : [])] },
            deck: padDeck(16),
          },
        });
        const target = g.player2.active;
        const defender = target.getPokemonCard()!;
        defender.hp = 1000;
        defender.weakness = [];
        defender.resistance = [];
        g.state.activePlayer = 1;
        useAttack(g.store, g.state, 1, 'Elegant Swim');
        expect(target.preventEffectsOfAttacksNextTurn).toBe(shield);

        if (setup.defenderEnergy) target.moveCardTo(target.energies.cards[0], g.player2.discard);
        if (setup.exDefender) defender.tags = [...defender.tags, CardTag.POKEMON_ex];
        const source = g.player1.active;
        source.damage = setup.rest?.[0] ?? setup.selfDamage ?? 0;
        if (setup.rest) {
          source.addSpecialCondition(BURNED);
          source.addSpecialCondition(POISONED);
        }
        if (setup.stack) source.cards.unshift(...setup.stack.map(getCardByName));
        if (setup.recent) source.pokemonPlayedTurn = g.state.turn;
        if (setup.tool) source.tools.push(getCardByName(setup.tool));
        if (setup.confirm !== undefined) g.overridePrompt('Confirm', () => setup.confirm);

        if (setup.tails) random.and.returnValue(0.9);
        else random.and.returnValue(0.1);
        const flip = (): boolean => {
          g.overridePrompt('Coin flip', flip);
          return !setup.tails;
        };
        g.overridePrompt('Coin flip', flip);
        const observed = new Map<SpecialCondition, number>();
        const self = new Map<SpecialCondition, number>();
        let damageAfterAttack: number | undefined;
        const reduce = g.store.reduceEffect.bind(g.store);
        spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof AfterAttackEffect && effect.player === g.player1) damageAfterAttack = target.damage;
          const next = reduce(state, effect);
          if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
            const received = effect.target === target ? observed : effect.target === source ? self : undefined;
            if (received) {
              for (const condition of effect.specialConditions) {
                if (effect.target.specialConditions.includes(condition)) {
                  expect(effect instanceof AddSpecialConditionsEffect).toBe(true);
                  received.set(condition, target.damage);
                }
              }
            }
          }
          return next;
        });

        useAttack(g.store, g.state, 0, attack);

        const expectedDamage = shield ? 0 : damage;
        const atDamage = (conditions: SpecialCondition[]) => conditions.slice().sort().map<[SpecialCondition, number]>(condition => [condition, expectedDamage]);
        expect(damageAfterAttack).toBe(expectedDamage);
        expect([...observed.entries()].sort()).toEqual(atDamage(shield ? [] : targetConditions));
        expect([...self.entries()].sort()).toEqual(atDamage(selfConditions));
        if (setup.selfDiscard !== undefined) expect(g.player1.discard.cards.length).toBe(setup.selfDiscard);
        if (setup.poison !== undefined) expect(target.poisonDamage).toBe(shield ? 10 : setup.poison);
        if (setup.switch) expect(g.player1.active.getPokemonCard()?.fullName).toBe('Rookidee SSH');
        if (setup.endDamage !== undefined) expect(source.damage).toBe(setup.endDamage);
        if (setup.rest) {
          expect(source.damage).toBe(setup.rest[1]);
          expect(source.specialConditions).not.toContain(POISONED);
          expect(source.specialConditions).not.toContain(BURNED);
        }
        g.store.cleanup();
      });
    }
  }
});

describe('Payment must succeed before the printed condition resolves', () => {
  beforeAll(ensureClientCards);

  const lightning = 'Lightning Energy SVE';
  const grass = 'Grass Energy SVE';
  const dark = 'Darkness Energy SVE';
  const counter = 'Counter Energy CIN';
  const rainbow = 'Rainbow Energy TR';

  for (const choice of ['decline', 'counter', 'blocked', 'short']) {
    it(`Paralyzing Bolt handles the ${choice} payment path`, () => {
      const energy = choice === 'counter' ? [lightning, counter] : choice === 'short' ? [lightning, water] : [lightning, lightning, water];
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Bellibolt ex PAL', energy }, deck: padDeck(16) },
        player2: { active: { card: 'Finneon MT' }, prizeCount: 5, deck: padDeck(16) },
      });
      const defender = g.player2.active.getPokemonCard()!;
      defender.hp = 500;
      defender.weakness = [];
      if (choice === 'short') g.player1.stadium.cards.push(getCardByName('Thunder Mountain Prism Star LOT'));
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (choice === 'blocked' && effect instanceof DiscardCardsEffect && effect.target === g.player1.active) {
          effect.preventDefault = true;
          return state;
        }
        return reduce(state, effect);
      });
      let choices = 0;
      g.overridePrompt('Choose energy', prompt => {
        choices++;
        expect(g.player2.active.damage).toBe(160);
        const energyPrompt = prompt as ChooseEnergyPrompt;
        if (choice === 'decline') return null;
        if (choice === 'blocked') return [0, 1];
        return [energyPrompt.energy.findIndex(entry => entry.card.fullName === counter)];
      });

      useAttack(g.store, g.state, 0, 'Paralyzing Bolt');

      expect(choices).toBe(choice === 'short' ? 0 : 1);
      expect(g.player2.active.damage).toBe(160);
      expect(g.player2.active.specialConditions.includes(PARALYZED)).toBe(choice === 'counter');
      expect(g.player1.discard.cards.map(card => card.fullName)).toEqual(choice === 'counter' ? [counter] : []);
      g.store.cleanup();
    });
  }

  for (const protectedDefender of [false, true]) {
    it(`Poison Experiment discards Rainbow Energy ${protectedDefender ? 'against protection' : 'for both types'}`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Cacturne PL', energy: [grass, dark, rainbow] }, deck: padDeck(16) },
        player2: { active: { card: protectedDefender ? 'Skeledirge SSP' : 'Finneon MT' }, deck: padDeck(16) },
      });
      g.overridePrompt('Choose cards', prompt => {
        expect(g.player2.active.damage).toBe(20);
        return [(prompt as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === rainbow)];
      });

      useAttack(g.store, g.state, 0, 'Poison Experiment');

      expect(g.player1.discard.cards.map(card => card.fullName)).toEqual([rainbow]);
      expect(g.player2.active.specialConditions.slice().sort()).toEqual(protectedDefender ? [] : [PARALYZED, POISONED]);
      g.store.cleanup();
    });
  }

  for (const blocked of [false, true]) {
    it(`Ice Bind checks whether the defending player actually discarded a card when payment is ${blocked ? 'blocked' : 'accepted'}`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Walrein MT', energy: padDeck(3) }, deck: padDeck(16) },
        player2: { active: { card: 'Finneon MT' }, hand: [water], deck: padDeck(16) },
      });
      const target = g.player2.active;
      target.getPokemonCard()!.hp = 200;
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (blocked && effect instanceof MoveCardsEffect && effect.source === g.player2.hand && effect.destination === g.player2.discard) {
          effect.preventDefault = true;
          return state;
        }
        return reduce(state, effect);
      });
      g.overridePrompt('Confirm', () => true);
      g.overridePrompt('Choose cards', () => [0]);

      useAttack(g.store, g.state, 0, 'Ice Bind');

      expect(target.damage).toBe(70);
      expect(target.specialConditions.includes(PARALYZED)).toBe(blocked);
      expect(g.player2.discard.cards.length).toBe(blocked ? 0 : 1);
      g.store.cleanup();
    });
  }

  it('omits the Mountain Bite bonus when the top card cannot be discarded', () => {
    const g = setupGame({
      turn: 5,
      player1: { active: { card: 'Larvitar MT', energy: ['Fighting Energy SVE'] }, deck: padDeck(16) },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(16) },
    });
    const top = g.player1.deck.cards[0];
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof MoveCardsEffect && effect.source === g.player1.deck && effect.destination === g.player1.discard) {
        effect.preventDefault = true;
        return state;
      }
      return reduce(state, effect);
    });
    g.overridePrompt('Confirm', () => true);

    useAttack(g.store, g.state, 0, 'Mountain Bite');

    expect(g.player2.active.damage).toBe(10);
    expect(g.player1.active.specialConditions).not.toContain(ASLEEP);
    expect(g.player1.deck.cards[0]).toBe(top);
    g.store.cleanup();
  });
});

describe('Additional printed attack clauses', () => {
  beforeAll(ensureClientCards);

  for (const slot of [SlotType.ACTIVE, SlotType.BENCH]) {
    it(`Jumping Press can choose the opponent’s ${slot === SlotType.ACTIVE ? 'Active' : 'Benched'} Pokémon`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Bellibolt ex PAL', energy: padDeck(2) }, deck: padDeck(16) },
        player2: { active: { card: 'Finneon MT' }, bench: [{ card: 'Finneon MT' }], deck: padDeck(16) },
      });
      g.player2.active.getPokemonCard()!.hp = 200;
      g.player2.active.getPokemonCard()!.weakness = [{ type: CardType.LIGHTNING }];
      g.player2.bench[0].getPokemonCard()!.hp = 200;
      g.player2.bench[0].getPokemonCard()!.weakness = [{ type: CardType.LIGHTNING }];
      g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.TOP_PLAYER, slot, index: 0 }]);

      useAttack(g.store, g.state, 0, 'Jumping Press');

      expect(g.player2.active.damage).toBe(slot === SlotType.ACTIVE ? 100 : 0);
      expect(g.player2.bench[0].damage).toBe(slot === SlotType.BENCH ? 50 : 0);
      g.store.cleanup();
    });
  }
});
