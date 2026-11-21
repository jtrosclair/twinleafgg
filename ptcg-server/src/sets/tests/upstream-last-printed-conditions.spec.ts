import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { EnergyCard } from '../../game/store/card/energy-card';

const { ASLEEP, BURNED, CONFUSED, PARALYZED, POISONED } = SpecialCondition;
const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const fire = 'Fire Energy SVE';
const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const dark = 'Darkness Energy SVE';
const fighting = 'Fighting Energy SVE';

interface CardAttack {
  card: string;
  attack: string;
  energy: string[];
  damage: number;
  target?: SpecialCondition;
  self?: SpecialCondition;
  failsOnTails?: boolean;
  poison?: number;
  tailsDamage?: number;
}

const attacks: CardAttack[] = [
  { card: 'Snorlax 30C', attack: 'Collapse', energy: padDeck(3), damage: 130, self: ASLEEP },
  { card: 'Pikachu 30C 43', attack: 'Tropical Vibes', energy: padDeck(2), damage: 0, self: ASLEEP },
  { card: "Erika's Tangela MC", attack: 'Bind', energy: [grass, water], damage: 50, target: PARALYZED, failsOnTails: true },
  { card: "LaRousse's Munchlax PCGP", attack: 'Yawn', energy: [water], damage: 0, target: ASLEEP },
  { card: "PokéPark's Munchlax PCGP", attack: 'Body Slam', energy: padDeck(3), damage: 30, target: PARALYZED, failsOnTails: true },
  { card: "Sea's Manaphy PCGP", attack: 'Hypnosplash', energy: [water], damage: 10, target: ASLEEP },
  { card: "Sea's Manaphy PCGP 154", attack: 'Water Pulse', energy: padDeck(2), damage: 20, target: ASLEEP },
  { card: "Rota's Mime Jr. PCGP 86", attack: 'Teeter Dance', energy: [water], damage: 0, target: CONFUSED },
  { card: 'Treecko PCGP 37', attack: 'Tail Shake', energy: [grass], damage: 0, target: ASLEEP },
  { card: "PokéPark's Celebi PCGP", attack: 'Psyshock', energy: [grass, water], damage: 20, target: PARALYZED, failsOnTails: true },
  { card: 'Rotom MEE', attack: 'Thunder Shock', energy: [lightning, water], damage: 50, target: PARALYZED, failsOnTails: true },
  { card: 'Electivire M6', attack: 'Body Slam', energy: padDeck(2), damage: 30, target: PARALYZED, failsOnTails: true },
  { card: 'Mega Malamar ex M6', attack: 'Eerie Wave', energy: [dark, dark, dark], damage: 200, target: CONFUSED },
  { card: 'Vulpix M4', attack: 'Singe', energy: [fire], damage: 0, target: BURNED },
  { card: 'Vulpix M4 8', attack: 'Singe', energy: [fire], damage: 0, target: BURNED },
  { card: 'Mareep M4', attack: 'Thunder Wave', energy: [lightning, water], damage: 20, target: PARALYZED, failsOnTails: true },
  { card: 'Mareep M4 27', attack: 'Thunder Wave', energy: [lightning, water], damage: 20, target: PARALYZED, failsOnTails: true },
  { card: "Brock's Zubat G1 74", attack: 'Poison Fang', energy: [grass, water], damage: 20, target: POISONED, failsOnTails: true },
  { card: 'Pichu Bros. P3', attack: 'Bustle', energy: [lightning, lightning], damage: 40, target: CONFUSED, failsOnTails: true, tailsDamage: 0 },
  { card: 'Forretress P3', attack: 'Toxic', energy: [grass, grass, water], damage: 20, target: POISONED, poison: 20 },
  { card: 'Onix SI', attack: 'Body Slam', energy: Array(4).fill(fighting), damage: 40, target: PARALYZED, failsOnTails: true },
  { card: 'Whismur NP', attack: 'Supersonic', energy: [water], damage: 0, target: CONFUSED, failsOnTails: true },
  { card: 'Slowking HS', attack: 'Psyshock', energy: [psychic, water], damage: 30, target: PARALYZED, failsOnTails: true },
  { card: 'Oshawott BWP 8', attack: 'Sleep Pulse', energy: [water], damage: 0, target: ASLEEP, failsOnTails: true },
  { card: 'Oshawott BWP', attack: 'Water Pulse', energy: [water, water], damage: 20, target: ASLEEP, failsOnTails: true },
];

function attackGame(card: string, energy: string[], defender = 'Finneon MT', defenderBench: string[] = []) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card, energy }, deck: padDeck(16) },
    player2: { active: { card: defender, energy: padDeck(2) }, bench: defenderBench.map(card => ({ card })), deck: padDeck(16) },
  });
  const target = game.player2.active.getPokemonCard()!;
  target.hp = 999;
  target.weakness = [];
  target.resistance = [];
  return game;
}

describe('Printed Special Conditions after damage', () => {
  beforeAll(ensureClientCards);

  for (const entry of attacks) {
    for (const mode of ['direct', 'protected', 'copied', ...(entry.failsOnTails ? ['tails'] : [])]) {
      it(`${entry.card} ${entry.attack} resolves the printed condition (${mode})`, () => {
        const copied = mode === 'copied';
        const energy = copied ? [...entry.energy, ...padDeck(3)].slice(0, Math.max(3, entry.energy.length)) : entry.energy;
        const game = attackGame(copied ? 'Mew ex MEW' : entry.card, energy, copied ? entry.card : 'Finneon MT');
        const source = game.player1.active;
        const target = game.player2.active;
        if (mode === 'protected') target.preventEffectsOfAttacksNextTurn = true;
        spyOn(Math, 'random').and.returnValue(mode === 'tails' ? 0.95 : 0.05);
        const damage = mode === 'tails' ? entry.tailsDamage ?? entry.damage : entry.damage;
        let typedApplications = 0;
        let blockedApplications = 0;
        const reduce = game.store.reduceEffect.bind(game.store);
        spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof AddSpecialConditionsPowerEffect) fail('An attack must carry its own effect source');
          const next = reduce(state, effect);
          if (effect instanceof AddSpecialConditionsEffect) {
            expect(effect.source).toBe(source);
            expect(effect.target).toBe(entry.self ? source : target);
            expect(target.damage).toBe(damage);
            expect(effect.specialConditions).toEqual([entry.self ?? entry.target!]);
            if (entry.poison !== undefined) expect(effect.poisonDamage).toBe(entry.poison);
            if (effect.preventDefault) blockedApplications++;
            else typedApplications++;
          }
          return next;
        });
        if (copied) game.overridePrompt('Choose attack', () => ({ index: 0, attack: entry.attack }));
        useAttack(game.store, game.state, 0, copied ? 'Genome Hacking' : entry.attack);
        expect(typedApplications).toBe(mode === 'tails' || mode === 'protected' && !entry.self ? 0 : 1);
        expect(blockedApplications).toBe(mode === 'protected' && !entry.self ? 1 : 0);
        if (entry.self || mode === 'tails' || mode === 'protected' || ![POISONED, BURNED].includes(entry.target!)) {
          expect(target.damage).toBe(damage);
        }
        game.store.cleanup();
      });
    }
  }

  it('applies Teeter Dance’s own Confusion on tails even when the defender is protected', () => {
    const game = attackGame("Rota's Mime Jr. PCGP 86", [water]);
    game.player2.active.preventEffectsOfAttacksNextTurn = true;
    spyOn(Math, 'random').and.returnValue(0.95);
    useAttack(game.store, game.state, 0, 'Teeter Dance');
    expect(game.player1.active.specialConditions).toContain(CONFUSED);
    expect(game.player2.active.specialConditions).not.toContain(CONFUSED);
    game.store.cleanup();
  });

  it('draws up to six after Tropical Vibes commits Sleep', () => {
    const game = attackGame('Pikachu 30C 43', padDeck(2));
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(ASLEEP)) {
        expect(game.player1.hand.cards.length).toBe(0);
      }
      return reduce(state, effect);
    });
    useAttack(game.store, game.state, 0, 'Tropical Vibes');
    expect(game.player1.hand.cards.length).toBe(6);
    game.store.cleanup();
  });
});

describe('Additional printed attack interactions', () => {
  beforeAll(ensureClientCards);

  for (const slot of [SlotType.ACTIVE, SlotType.BENCH]) {
    it(`Bass Control exclusively damages the chosen ${SlotType[slot]} Pokémon`, () => {
      const game = attackGame("LaRousse's Munchlax PCGP", padDeck(2), 'Finneon MT', ['Squirtle BS']);
      game.overridePrompt('Choose pokemon', () => [{ player: PlayerType.TOP_PLAYER, slot, index: 0 }]);
      useAttack(game.store, game.state, 0, 'Bass Control');
      expect(game.player2.active.damage).toBe(slot === SlotType.ACTIVE ? 20 : 0);
      expect(game.player2.bench[0].damage).toBe(slot === SlotType.BENCH ? 20 : 0);
      game.store.cleanup();
    });
  }

  it('Miraculous Light heals and cures the actual attacker', () => {
    const game = attackGame("Sea's Manaphy PCGP", padDeck(2));
    game.player1.active.damage = 30;
    game.player1.active.addSpecialCondition(POISONED);
    game.player1.active.addSpecialCondition(BURNED);
    useAttack(game.store, game.state, 0, 'Miraculous Light');
    expect(game.player1.active.damage).toBe(20);
    expect(game.player1.active.specialConditions).toEqual([]);
    expect(game.player2.active.damage).toBe(20);
    game.store.cleanup();
  });

  for (const heads of [false, true]) {
    it(`Defense Curl prevents next-turn damage after heads only (${heads})`, () => {
      const game = attackGame("PokéPark's Munchlax PCGP", [water]);
      spyOn(Math, 'random').and.returnValue(heads ? 0.05 : 0.95);
      useAttack(game.store, game.state, 0, 'Defense Curl');
      useAttack(game.store, game.state, 1, 'Tackle');
      expect(game.player1.active.damage).toBe(heads ? 0 : 20);
      game.store.cleanup();
    });
  }

  for (const [name, energy] of [
    ["Sea's Manaphy PCGP 154", water], ["PokéPark's Celebi PCGP", grass],
  ]) {
    it(`${name} cures on attachment from hand only`, () => {
      const game = attackGame(name, []);
      const target = game.player1.active;
      const card = getCardByName(energy) as EnergyCard;
      target.addSpecialCondition(POISONED);
      game.store.reduceEffect(game.state, new AttachEnergyEffect(game.player1, card, target, 'deck'));
      expect(target.specialConditions).toContain(POISONED);
      game.player1.hand.cards.push(getCardByName(energy));
      playTrainerCard(game.store, game.state, 0, energy);
      expect(target.specialConditions).not.toContain(POISONED);
      game.store.cleanup();
    });
  }

  for (const blocked of [false, true]) {
    it(`Voltaic Hammer counts only Energy that actually reaches discard (${blocked})`, () => {
      const game = attackGame('Electivire M6', [lightning, lightning, water, water]);
      const source = game.player1.active;
      const energy = source.energies.cards[0];
      if (blocked) {
        const reduce = game.store.reduceEffect.bind(game.store);
        spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
          if (effect instanceof DiscardCardsEffect && effect.target === source) {
            effect.preventDefault = true;
            return state;
          }
          return reduce(state, effect);
        });
      }
      game.overridePrompt('Discard energy', () => [{
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }, index: source.cards.indexOf(energy),
      }]);
      useAttack(game.store, game.state, 0, 'Voltaic Hammer');
      expect(game.player2.active.damage).toBe(blocked ? 0 : 60);
      expect(source.energies.cards.includes(energy)).toBe(blocked);
      game.store.cleanup();
    });
  }
});
