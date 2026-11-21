import { ensureClientCards } from '../../client/cards';
import { SpecialCondition, Stage } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { Prompt } from '../../game/store/prompts/prompt';
import { State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const { ASLEEP, BURNED, CONFUSED, PARALYZED, POISONED } = SpecialCondition;
type Outcome = [damage: number, opponent: SpecialCondition[], self: SpecialCondition[]];
interface AdditionalEffects {
  switches?: true;
  shuffles?: true;
  discards?: number;
  draws?: number;
  initialDamage?: number;
  selfDamage?: number;
  benchDamage?: number;
  usedGX?: true;
  poisonDamage?: number;
  sleepFlips?: number;
  tails?: Outcome;
}

type PrintedAttack = [card: string, attack: string, energy: string[], ...outcome: Outcome, effects?: AdditionalEffects];

const attacks: PrintedAttack[] = [
  ["Annihilape SSP", "Tantrum", ["Fighting Energy SVE"], 130, [], [CONFUSED]],
  ["Caterpie BS", "String Shot", ["Grass Energy SVE"], 10, [PARALYZED], []],
  ["Nidoking BS", "Toxic", ["Grass Energy SVE", "Grass Energy SVE", "Grass Energy SVE"], 20, [POISONED], [], {poisonDamage: 20}],
  ["Koffing BS", "Foul Gas", ["Grass Energy SVE", "Grass Energy SVE"], 10, [POISONED], [], {tails: [10, [CONFUSED], []]}],
  ["Tangela", "Bind", ["Grass Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Tangela", "Poisonpowder", ["Grass Energy SVE", "Grass Energy SVE", "Grass Energy SVE"], 20, [POISONED], []],
  ["Dunsparce CES", "Sudden Flash", ["Water Energy SVE"], 10, [PARALYZED], []],
  ["Gulpin CES", "Yawn", ["Water Energy SVE"], 0, [ASLEEP], []],
  ["Gulpin CES", "Spit Poison", ["Psychic Energy SVE"], 0, [POISONED], []],
  ["Spinarak CES", "Stun Poison", ["Grass Energy SVE"], 0, [PARALYZED, POISONED], [], {tails: [0, [], []]}],
  ["Porygon TR", "Psybeam", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 20, [CONFUSED], []],
  ["Oddish TR", "Sleep Powder", ["Grass Energy SVE"], 0, [ASLEEP], []],
  ["Oddish TR", "Poisonpowder", ["Grass Energy SVE"], 0, [POISONED], []],
  ["Dark Vileplume TR", "Petal Whirlwind", ["Grass Energy SVE", "Grass Energy SVE", "Grass Energy SVE"], 90, [], [CONFUSED], {tails: [0, [], []]}],
  ["Meganium MT", "Ultra Powder", ["Grass Energy SVE"], 20, [BURNED, PARALYZED, POISONED], [], {tails: [20, [], []]}],
  ["Dewgong MT", "Collapse", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [], [ASLEEP]],
  ["Girafarig PAL", "Psy Bolt", ["Water Energy SVE", "Water Energy SVE"], 30, [PARALYZED], []],
  ["Gothita PAL", "Eerie Wave", ["Psychic Energy SVE", "Water Energy SVE"], 20, [CONFUSED], []],
  ["Glimmora PAL", "Poison Petals", ["Fighting Energy SVE"], 0, [POISONED], [], {poisonDamage: 60}],
  ["Dudunsparce PAL", "Dig Away Flash", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 100, [PARALYZED], [], {shuffles: true}],
  ["Gothorita PAL", "Mind Bend", ["Water Energy SVE"], 20, [CONFUSED], []],
  ["Luxray V ASR", "Radiating Pulse", ["Lightning Energy SVE", "Lightning Energy SVE", "Water Energy SVE"], 120, [PARALYZED], [], {discards: 2}],
  ["Jirachi V ASR 170", "Hypnostrike", ["Psychic Energy SVE", "Water Energy SVE"], 60, [ASLEEP], [ASLEEP]],
  ["Hisuian Overqwil ASR", "Tormenting Poison", [], 0, [POISONED], [], {poisonDamage: 50}],
  ["Bronzor ASR", "Metal Press", ["Metal Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Musharna PLB", "Precognitive Dream", ["Psychic Energy SVE"], 0, [], [ASLEEP], {draws: 3}],
  ["Musharna PLB", "Psybeam", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [CONFUSED], []],
  ["Abomasnow PLB", "Bang Heads", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 80, [CONFUSED], [CONFUSED]],
  ["Galvantula VIV", "Stun Needle", ["Lightning Energy SVE"], 20, [PARALYZED], []],
  ["Accelgor JTG", "Poisonous Ploy", ["Grass Energy SVE", "Water Energy SVE"], 70, [CONFUSED, POISONED], [], {switches: true}],
  ["Butterfree JTG", "Scale Hurricane", ["Grass Energy SVE"], 240, [PARALYZED], [], {tails: [0, [], []]}],
  ["Roselia SF", "Petal Spikes", ["Psychic Energy SVE", "Water Energy SVE"], 20, [ASLEEP, POISONED], [], {tails: [20, [], []]}],
  ["Tangrowth SF", "Green Acid", ["Grass Energy SVE", "Water Energy SVE"], 20, [CONFUSED, POISONED], [], {tails: [20, [], []]}],
  ["Drapion SF", "Cross Poison", ["Water Energy SVE", "Water Energy SVE"], 80, [POISONED], [], {tails: [0, [], []]}],
  ["Vespiquen SF", "Bee Powder", ["Grass Energy SVE", "Water Energy SVE"], 50, [BURNED, PARALYZED, POISONED], [], {tails: [50, [], []]}],
  ["Purugly BST", "Caturday", ["Water Energy SVE"], 0, [], [ASLEEP], {draws: 3}],
  ["Galarian Slowbro BST", "Splattering Poison", ["Darkness Energy SVE"], 0, [POISONED], [POISONED]],
  ["Slakoth FFI", "Big Yawn", ["Water Energy SVE", "Water Energy SVE"], 0, [ASLEEP], [ASLEEP]],
  ["Scrafty FFI", "Machine Gun Headbutt", ["Darkness Energy SVE", "Darkness Energy SVE"], 150, [], [CONFUSED]],
  ["Banette CG", "Night Murmurs", ["Psychic Energy SVE", "Water Energy SVE"], 30, [CONFUSED], []],
  ["Treecko CG", "Paralyzing Gaze", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Venusaur CG", "Toxic Sleep", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 0, [ASLEEP, POISONED], [], {poisonDamage: 20}],
  ["Inkay XY", "Confusion Wave", ["Darkness Energy SVE"], 0, [CONFUSED], [CONFUSED]],
  ["Musharna UNM", "Rest Well", ["Water Energy SVE"], 0, [ASLEEP], [ASLEEP]],
  ["Komala UNM", "Snooze", ["Water Energy SVE"], 0, [], [ASLEEP]],
  ["Flareon SK", "Singe", ["Fire Energy SVE"], 0, [BURNED], []],
  ["Gloom BCR", "Foul Odor", ["Water Energy SVE", "Water Energy SVE"], 0, [CONFUSED], [CONFUSED]],
  ["Gloom BCR", "Poison Powder", ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 40, [POISONED], []],
  ["Bellossom BCR", "Petal Dance", ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 150, [], [CONFUSED]],
  ["Regigigas V CRZ", "Angry Whack", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 100, [], [CONFUSED]],
  ["Salazzle CRZ 28", "Tail Trickery", ["Water Energy SVE"], 20, [CONFUSED], []],
  ["Salazzle CRZ 28", "Super Singe", ["Fire Energy SVE", "Water Energy SVE"], 60, [BURNED], []],
  ["Dustox DP", "Toxic Dust", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 50, [POISONED], [], {poisonDamage: 20}],
  ["Skuntank DP", "Toxic Cloud", ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"], 30, [POISONED], [], {poisonDamage: 20}],
  ["Gloom AQ", "Sleep Sap", ["Water Energy SVE", "Water Energy SVE"], 20, [ASLEEP], [ASLEEP]],
  ["Chinchou AQ", "Jolt", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Chinchou AQ", "Confuse Ray", ["Lightning Energy SVE", "Water Energy SVE"], 10, [CONFUSED], []],
  ["Marill BUS", "Bubble", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Bewear BUS", "Tantrum", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 120, [], [CONFUSED]],
  ["Vileplume BUS", "Downer Shock", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 60, [ASLEEP], [], {tails: [60, [CONFUSED], []]}],
  ["Scolipede EPO", "Toxic Claws", ["Psychic Energy SVE", "Water Energy SVE"], 30, [POISONED], [], {poisonDamage: 20}],
  ["Psyduck PL", "Latent Power", ["Water Energy SVE"], 30, [], [], {tails: [0, [], [CONFUSED]]}],
  ["Muk PL", "Strange Poison", ["Psychic Energy SVE", "Water Energy SVE"], 30, [POISONED], [], {tails: [30, [], [POISONED]]}],
  ["Giratina PL4", "Dragonbreath", ["Psychic Energy SVE", "Psychic Energy SVE", "Water Energy SVE"], 80, [PARALYZED], [], {tails: [0, [], []]}],
  ["Muk TEU", "Toxic Secretion", ["Psychic Energy SVE"], 40, [POISONED], [], {poisonDamage: 20}],
  ["Celebi & Venusaur-GX TEU", "Pollen Hazard", ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 50, [BURNED, CONFUSED, POISONED], []],
  ["Snorlax RR", "Roll Over", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [ASLEEP], [ASLEEP], {tails: [60, [], [ASLEEP]]}],
  ["Snorlax RR2", "Heavy Press", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [], [], {tails: [40, [], [ASLEEP]]}],
  ["Gloom LA2", "Space Out", [], 0, [], [ASLEEP], {initialDamage: 40, selfDamage: 20}],
  ["Glameow UNB", "Caturday", ["Water Energy SVE"], 0, [], [ASLEEP], {draws: 1}],
  ["Meowstic UNB", "Caturday", ["Water Energy SVE"], 0, [], [ASLEEP], {draws: 3}],
  ["Koffing UNB", "Foul Odor", ["Water Energy SVE"], 0, [CONFUSED], [CONFUSED]],
  ["Litten UNB 27", "Caturday", ["Water Energy SVE"], 0, [], [ASLEEP], {draws: 1}],
  ["Muk & Alolan Muk-GX UNB", "Severe Poison", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"], 0, [POISONED], [], {poisonDamage: 80}],
  ["Muk & Alolan Muk-GX UNB", "Nasty Goo Mix-GX", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 0, [PARALYZED, POISONED], [], {usedGX: true, poisonDamage: 150}],
  ["Whismur PHF", "Screaming Fit", ["Water Energy SVE"], 0, [CONFUSED], [CONFUSED]],
  ["Musharna PHF", "Dream Dance", ["Psychic Energy SVE", "Water Energy SVE"], 30, [ASLEEP], [ASLEEP]],
  ["Gengar-EX PHF", "Dark Corridor", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [POISONED], [], {switches: true}],
  ["Roselia UL", "Petal Dance", ["Grass Energy SVE"], 60, [], [CONFUSED], {tails: [0, [], [CONFUSED]]}],
  ["Tauros UL", "Crimson Bull", ["Water Energy SVE", "Water Energy SVE"], 90, [], [CONFUSED]],
  ["M Slowbro-EX EVO", "Loll Roll Spin", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 100, [], [CONFUSED]],
  ["Tangela EVO", "Bind", ["Grass Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Tangela EVO", "Poison Powder", ["Grass Energy SVE", "Grass Energy SVE", "Grass Energy SVE"], 30, [POISONED], []],
  ["Dodrio PLS", "Raging Pecks", ["Water Energy SVE"], 90, [], [CONFUSED]],
  ["Bellossom UD", "Dance 'til Dawn", ["Grass Energy SVE", "Water Energy SVE"], 90, [], [ASLEEP]],
  ["Drapion SSH", "Hard Press", ["Darkness Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [PARALYZED], []],
  ["Drapion SSH", "Toxic Strike", ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE", "Water Energy SVE"], 130, [POISONED], []],
  ["Sunflora SW", "Petal Dance", ["Grass Energy SVE", "Grass Energy SVE"], 90, [], [CONFUSED], {tails: [0, [], []]}],
  ["Spinda PRC", "Staggering Steps", ["Water Energy SVE"], 0, [CONFUSED], [], {tails: [0, [], [CONFUSED]]}],
  ["Garbodor BKP", "Offensive Bomb", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [CONFUSED, POISONED], []],
  ["Lilligant BLW", "Petal Dance", ["Grass Energy SVE"], 90, [], [CONFUSED]],
  ["Wynaut LM", "Confusion Wave", ["Water Energy SVE"], 0, [CONFUSED], [CONFUSED]],
  ["Victreebel LM", "Sleep Poison", ["Grass Energy SVE", "Water Energy SVE"], 10, [ASLEEP, POISONED], []],
  ["Muk LM", "Poison Ring", ["Grass Energy SVE", "Water Energy SVE"], 20, [POISONED], []],
  ["Misty's Staryu DRI", "Bubble Beam", ["Water Energy SVE"], 20, [PARALYZED], []],
  ["Team Rocket's Nidoking ex DRI", "Dirty Horns", ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"], 100, [POISONED], [], {poisonDamage: 80}],
  ["Bidoof DRX", "Bang Heads", ["Water Energy SVE", "Water Energy SVE"], 20, [CONFUSED], [CONFUSED]],
  ["Bibarel DRX", "Tumbling Tackle", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 60, [ASLEEP], [ASLEEP]],
  ["Vileplume ex HL", "Special Formula", ["Grass Energy SVE", "Water Energy SVE", "Water Energy SVE"], 50, [ASLEEP, POISONED], [], {tails: [50, [CONFUSED], []]}],
  ["Spheal HL", "Freezing Breath", ["Water Energy SVE"], 0, [PARALYZED], [], {tails: [0, [ASLEEP], []]}],
  ["Goomy GRI", "Bubble", ["Water Energy SVE"], 0, [PARALYZED], []],
  ["Lilligant GRI", "Petal Dance", ["Grass Energy SVE", "Water Energy SVE"], 120, [], [CONFUSED]],
  ["Ivysaur DEX", "Sleep Powder", ["Grass Energy SVE", "Water Energy SVE"], 20, [ASLEEP], []],
  ["Ivysaur DEX", "Poison Powder", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 50, [POISONED], []],
  ["Flying Pikachu V CEL", "Thunder Shock", ["Lightning Energy SVE"], 20, [PARALYZED], []],
  ["Onix SS", "Bind", ["Water Energy SVE", "Water Energy SVE"], 10, [PARALYZED], []],
  ["Deino SV11W", "Body Slam", ["Water Energy SVE", "Water Energy SVE"], 20, [PARALYZED], []],
  ["Glimmet OBF", "Poison Shard", ["Fighting Energy SVE", "Fighting Energy SVE"], 20, [POISONED], []],
  ["Glimmora ex OBF", "Poisonous Gem", ["Fighting Energy SVE", "Fighting Energy SVE"], 140, [POISONED], []],
  ["Tangela CEC", "Toxic", ["Grass Energy SVE"], 0, [POISONED], [], {poisonDamage: 20}],
  ["Stunky UPR", "Gas Bond", ["Darkness Energy SVE"], 10, [CONFUSED], [CONFUSED]],
  ["Mudkip RS", "Bubble", ["Water Energy SVE"], 10, [PARALYZED], []],
  ["Marshtomp RS", "Bubble", ["Water Energy SVE"], 10, [PARALYZED], []],
  ["Mega Lopunny & Jigglypuff-GX CEC", "Puffy Smashers-GX", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 0, [ASLEEP], [], {benchDamage: 200, usedGX: true}],
  ["Darkrai GE", "Sleep Hole", ["Darkness Energy SVE", "Darkness Energy SVE", "Water Energy SVE"], 40, [ASLEEP], []],
  ["Relicanth GE", "Sleep Swirl", ["Water Energy SVE", "Water Energy SVE"], 30, [ASLEEP], [ASLEEP]],
  ["Butterfree GE", "Dozing Scales", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 60, [ASLEEP], [], {tails: [60, [POISONED], []]}],
  ["Altaria GE", "Dragonbreath", ["Water Energy SVE"], 40, [PARALYZED], [], {tails: [0, [], []]}],
  ["Weezing FCO", "Thick Liquid", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [CONFUSED, POISONED], [CONFUSED, POISONED]],
  ["Salazzle CIN", "Severe Poison", ["Psychic Energy SVE"], 0, [POISONED], [], {poisonDamage: 40}],
  ["Piloswine CIN", "Rest", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {initialDamage: 40, selfDamage: 0}],
  ["Bronzor MD", "Hypnosis", ["Water Energy SVE"], 0, [ASLEEP], []],
  ["Bronzor MD", "Confuse Ray", ["Psychic Energy SVE"], 10, [CONFUSED], []],
  ["Muk DAA", "Triple Poison", ["Darkness Energy SVE"], 0, [POISONED], [], {poisonDamage: 30}],
  ["Crobat SFA", "Poison Fang", ["Darkness Energy SVE", "Water Energy SVE"], 120, [POISONED], [], {poisonDamage: 20}],
  ["Corphish DR", "Poison Claws", ["Water Energy SVE"], 0, [POISONED], []],
  ["Corphish DR", "Bubble", ["Water Energy SVE"], 10, [PARALYZED], []],
  ["Psyduck CEC", "Confusion Wave", ["Water Energy SVE", "Water Energy SVE"], 20, [CONFUSED], [CONFUSED]],
  ["Vileplume-GX CEC", "Allergic Explosion-GX", ["Grass Energy SVE"], 50, [BURNED, PARALYZED, POISONED], [], {usedGX: true}],
  ["Vileplume EX", "Petal Dance", ["Grass Energy SVE", "Water Energy SVE"], 90, [], [CONFUSED]],
  ["Gloom CEC", "Sleep Powder", ["Grass Energy SVE"], 20, [ASLEEP], []],
  ["Machamp-EX AOR", "Steaming Mad", ["Fighting Energy SVE", "Water Energy SVE"], 40, [], [CONFUSED], {initialDamage: 20}],
  ["Growlithe LTR", "Rest", ["Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {initialDamage: 40, selfDamage: 0}],
  ["Sealeo FLF", "Rest", ["Water Energy SVE", "Water Energy SVE"], 0, [], [ASLEEP], {initialDamage: 40, selfDamage: 0}],
  ["Snorlax FLF", "Sleepy Press", ["Water Energy SVE", "Water Energy SVE", "Water Energy SVE", "Water Energy SVE"], 120, [], [ASLEEP], {initialDamage: 40, selfDamage: 20}],
  ["Parasect SV", "Hibernation Spore", ["Grass Energy SVE", "Grass Energy SVE", "Water Energy SVE"], 40, [ASLEEP], [], {sleepFlips: 2}],
  ["Granbull BKT", "Tantrum", ["Fairy Energy XY", "Water Energy SVE", "Water Energy SVE"], 120, [], [CONFUSED]],
  ["Farigiraf TWM", "Eerie Wave", ["Psychic Energy SVE", "Water Energy SVE", "Water Energy SVE"], 80, [CONFUSED], []],
  ["Torkoal SUM", "Singe", ["Fire Energy SVE"], 0, [BURNED], []],
  ["Torkoal SUM", "Body Slam", ["Fire Energy SVE", "Water Energy SVE"], 50, [PARALYZED], []],
  ["Psyduck SUM", "Confusion Wave", ["Water Energy SVE"], 0, [CONFUSED], [CONFUSED]],
];

describe('Compound Special Condition attacks follow their printed text', () => {
  beforeAll(ensureClientCards);

  for (const [card, attack, energy, damage, opponent, self, extras = {}] of attacks) {
    const outcomes: { label: string; random: number; result: Outcome }[] = [
      { label: 'heads', random: 0.1, result: [damage, opponent, self] },
    ];
    if (extras.tails) outcomes.push({ label: 'tails', random: 0.9, result: extras.tails });

    for (const shield of [false, true]) {
      for (const { label, random, result } of outcomes) {
        it(`${card}: ${attack}, ${label}, ${shield ? 'with' : 'without'} Elegant Swim`, () => {
          const coin = spyOn(Math, 'random').and.returnValue(shield ? 0.1 : 0.9);
          const g = setupGame({
            turn: 5,
            player1: { active: { card, energy }, bench: [{ card: 'Rookidee SSH' }], deck: padDeck(16) },
            player2: {
              active: { card: 'Finneon MT', energy: ['Water Energy SVE'] },
              bench: [{ card: 'Rookidee SSH' }],
              deck: padDeck(16),
            },
          });
          const target = g.player2.active;
          const defender = target.getPokemonCard()!;
          defender.hp = 1000;
          // Give the shield carrier an Evolution stage to match Disgusting Pollen.
          if (card === 'Vileplume BUS') defender.stage = Stage.STAGE_1;
          defender.weakness = [];
          defender.resistance = [];
          g.player2.bench[0].getPokemonCard()!.hp = 1000;
          g.state.activePlayer = 1;
          useAttack(g.store, g.state, 1, 'Elegant Swim');
          expect(target.preventEffectsOfAttacksNextTurn).toBe(shield);
          const source = g.player1.active;
          source.damage = extras.initialDamage ?? 0;
          const originalCard = source.getPokemonCard()!;
          const handBefore = g.player1.hand.cards.length;
          const observed = new Map<SpecialCondition, number>();
          const observedSelf = new Map<SpecialCondition, number>();
          let damageAfterAttack: number | undefined;
          const reduce = g.store.reduceEffect.bind(g.store);
          spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
            if (effect instanceof AfterAttackEffect && effect.player === g.player1) damageAfterAttack = target.damage;
            const next = reduce(state, effect);
            if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
              const destination = effect.target === target ? observed : effect.target === source ? observedSelf : undefined;
              if (destination) {
                for (const condition of effect.specialConditions) {
                  if (!effect.target.specialConditions.includes(condition)) continue;
                  expect(effect instanceof AddSpecialConditionsEffect).toBe(true);
                  if (effect instanceof AddSpecialConditionsEffect) expect(effect.source).toBe(source);
                  destination.set(condition, target.damage);
                }
              }
            }
            return next;
          });

          coin.and.returnValue(random);
          const flip = (): boolean => {
            g.overridePrompt('Coin flip', flip);
            return random < 0.5;
          };
          g.overridePrompt('Coin flip', flip);
          useAttack(g.store, g.state, 0, attack);
          const [printedDamage, targetConditions, sourceConditions] = result;
          const expectedDamage = shield ? 0 : printedDamage;
          expect(damageAfterAttack).toBe(expectedDamage);
          expect([...observed.entries()].sort()).toEqual(shield ? [] : [...targetConditions].sort().map(condition => [condition, expectedDamage]));
          expect([...observedSelf.entries()].sort()).toEqual([...sourceConditions].sort().map(condition => [condition, expectedDamage]));
          if (extras.poisonDamage !== undefined) expect(target.poisonDamage).toBe(shield ? 10 : extras.poisonDamage);
          if (extras.sleepFlips !== undefined) expect(target.sleepFlips).toBe(shield ? 1 : extras.sleepFlips);
          if (extras.switches || extras.shuffles) expect(g.player1.active.getPokemonCard()!.fullName).toBe('Rookidee SSH');
          if (extras.shuffles) expect(g.player1.deck.cards).toContain(originalCard);
          if (extras.discards !== undefined) expect(g.player1.discard.cards.length).toBe(extras.discards);
          if (extras.draws !== undefined) expect(g.player1.hand.cards.length - handBefore).toBe(extras.draws);
          if (extras.selfDamage !== undefined) expect(source.damage).toBe(extras.selfDamage);
          if (extras.benchDamage !== undefined) expect(g.player2.bench[0].damage).toBe(extras.benchDamage);
          if (extras.usedGX) expect(g.player1.usedGX).toBe(true);
          g.store.cleanup();
        });
      }
    }
  }
});

describe('Printed conditions for classic status and damage bonuses', () => {
  beforeAll(ensureClientCards);

  for (const priorDamage of [0, 10]) {
    it(`Poison Spike checks the ${priorDamage} damage already on the defender`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Sandslash MT', energy: ['Fighting Energy SVE', 'Fighting Energy SVE', 'Water Energy SVE'] }, deck: padDeck(16) },
        player2: { active: { card: 'Finneon MT', damage: priorDamage }, deck: padDeck(16) },
      });
      g.player2.active.getPokemonCard()!.hp = 200;
      useAttack(g.store, g.state, 0, 'Poison Spike');
      const poisoned = priorDamage !== 0;
      expect(g.player2.active.specialConditions.includes(POISONED)).toBe(poisoned);
      expect(g.player2.active.damage).toBe(priorDamage + 60 + (poisoned ? 10 : 0));
      g.store.cleanup();
    });
  }

  for (const water of [false, true]) {
    it(`Swirling Ripple checks the entire opposing board ${water ? 'with' : 'without'} a Water Pokémon`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Masquerain MT', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(16) },
        player2: {
          active: { card: 'Rookidee SSH' },
          bench: [{ card: water ? 'Finneon MT' : 'Rookidee SSH' }],
          deck: padDeck(16),
        },
      });
      g.player2.active.getPokemonCard()!.hp = 200;
      useAttack(g.store, g.state, 0, 'Swirling Ripple');
      expect(g.player2.active.damage).toBe(water ? 60 : 30);
      expect(g.player2.active.specialConditions.includes(CONFUSED)).toBe(water);
      g.store.cleanup();
    });
  }

  for (const scramble of [false, true]) {
    for (const attack of ['Data Retrieval', 'Scramble Trip']) {
      it(`${attack} uses its own printed effect ${scramble ? 'with' : 'without'} Scramble Energy`, () => {
        const g = setupGame({
          turn: 5,
          player1: {
            active: { card: 'Porygon2 UF', energy: [...padDeck(3), ...(scramble ? ['Scramble Energy DX'] : [])] },
            deck: padDeck(16),
          },
          player2: { active: { card: 'Finneon MT' }, deck: padDeck(16) },
        });
        g.player1.active.cards.unshift(getCardByName('Porygon TR'));
        g.player2.active.getPokemonCard()!.hp = 200;
        useAttack(g.store, g.state, 0, attack);
        const retrieving = attack === 'Data Retrieval';
        expect(g.player1.hand.cards.length).toBe(retrieving ? 8 : 0);
        expect(g.player2.active.damage).toBe(retrieving ? 0 : scramble ? 60 : 40);
        expect(g.player2.active.specialConditions.includes(CONFUSED)).toBe(!retrieving && scramble);
        g.store.cleanup();
      });
    }
  }
});

describe('Copied compound attack source', () => {
  beforeAll(ensureClientCards);
  for (const shield of [false, true]) {
    it(`Mew ex copies Scale Hurricane ${shield ? 'with' : 'without'} Elegant Swim`, () => {
      const coin = spyOn(Math, 'random').and.returnValue(shield ? 0.1 : 0.9);
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Finneon MT', energy: padDeck(1) }, deck: padDeck(16) },
        player2: {
          active: { card: 'Mew ex 30C', energy: ['Grass Energy SVE'] },
          bench: [{ card: 'Butterfree JTG' }],
          deck: padDeck(16),
        },
      });
      const defender = g.player1.active;
      defender.getPokemonCard()!.hp = 300;
      useAttack(g.store, g.state, 0, 'Elegant Swim');
      expect(defender.preventEffectsOfAttacksNextTurn).toBe(shield);
      g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Scale Hurricane' }));

      // Exactly two heads are enough, even when the printed attack was copied.
      const results = new Map<number, boolean>();
      const flip = (prompt: Prompt<unknown>): boolean => {
        g.overridePrompt('Coin flip', flip);
        if (!results.has(prompt.id)) results.set(prompt.id, results.size < 2);
        return results.get(prompt.id)!;
      };
      g.overridePrompt('Coin flip', flip);
      coin.and.returnValue(0.1);
      const observed: string[] = [];
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AddSpecialConditionsEffect && effect.target === defender) {
          observed.push(effect.source.getPokemonCard()!.fullName);
        }
        return reduce(state, effect);
      });
      useAbility(g.store, g.state, 1, 'Memory Helix');

      expect(results.size).toBe(4);
      expect(observed).toEqual(['Mew ex 30C']);
      expect(defender.damage).toBe(shield ? 0 : 120);
      expect(defender.specialConditions.includes(PARALYZED)).toBe(!shield);
      g.store.cleanup();
    });
  }
});
