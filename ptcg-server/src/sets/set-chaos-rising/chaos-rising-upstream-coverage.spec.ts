import { Card, PokemonCard, PokemonCardList, TrainerCard, State, Player, TrainerType } from '../../game';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Store } from '../../game/store/store';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { setChaosRising } from './index';

// Snapshot of every registered print before upstream import (52fce8002).
const before: string[][] = [["Weedle M4", "M4", "1", "CRI 1"], ["Kakuna M4", "M4", "2", "CRI 2"], ["Beedrill ex M4", "M4", "3", "CRI 3"], ["Carnivine M4", "M4", "4", "CRI 4"], ["Chespin M4", "M4", "5", "CRI 5"], ["Quilladin M4", "M4", "6", "CRI 6"], ["Chesnaught M4", "M4", "7", "CRI 7"], ["Vulpix M4", "M4", "8", "CRI 8"], ["Ninetales M4", "M4", "9", "CRI 9"], ["Ho-Oh M4", "M4", "10", "CRI 10"], ["Fennekin M4", "M4", "11", "CRI 11"], ["Braixen M4", "M4", "12", "CRI 12"], ["Delphox M4", "M4", "13", "CRI 13"], ["Litleo M4", "M4", "14", "CRI 14"], ["Mega Pyroar ex M4", "M4", "15", "CRI 15"], ["Remoraid M4", "M4", "16", "CRI 16"], ["Octillery M4", "M4", "17", "CRI 17"], ["Delibird M4", "M4", "18", "CRI 18"], ["Keldeo M4", "M4", "19", "CRI 19"], ["Froakie M4", "M4", "20", "CRI 20"], ["Frogadier M4", "M4", "21", "CRI 21"], ["Mega Greninja ex M4", "M4", "22", "CRI 22"], ["Bergmite M4", "M4", "23", "CRI 23"], ["Avalugg M4", "M4", "24", "CRI 24"], ["Wimpod M4", "M4", "25", "CRI 25"], ["Golisopod M4", "M4", "26", "CRI 26"], ["Mareep M4", "M4", "27", "CRI 27"], ["Flaaffy M4", "M4", "28", "CRI 28"], ["Ampharos M4", "M4", "29", "CRI 29"], ["Emolga M4", "M4", "30", "CRI 30"], ["Deoxys M4", "M4", "31", "CRI 31"], ["Deoxys M4 32", "M4", "32", "CRI 32"], ["Deoxys M4 33", "M4", "33", "CRI 33"], ["Deoxys M4 34", "M4", "34", "CRI 34"], ["Mega Floette ex M4", "M4", "35", "CRI 35"], ["Espurr M4", "M4", "36", "CRI 36"], ["Meowstic M4", "M4", "37", "CRI 37"], ["Phantump M4", "M4", "38", "CRI 38"], ["Trevenant M4", "M4", "39", "CRI 39"], ["Pumpkaboo M4", "M4", "40", "CRI 40"], ["Gourgeist ex M4", "M4", "41", "CRI 41"], ["Xerneas M4", "M4", "42", "CRI 42"], ["Sudowoodo M4", "M4", "43", "CRI 43"], ["Phanpy M4", "M4", "44", "CRI 44"], ["Donphan M4", "M4", "45", "CRI 45"], ["Baltoy M4", "M4", "46", "CRI 46"], ["Claydol M4", "M4", "47", "CRI 47"], ["Zubat M4", "M4", "48", "CRI 49"], ["Golbat M4", "M4", "49", "CRI 50"], ["Crobat M4", "M4", "50", "CRI 51"], ["Qwilfish M4", "M4", "51", "CRI 52"], ["Stunky M4", "M4", "52", "CRI 53"], ["Skuntank M4", "M4", "53", "CRI 54"], ["Trubbish M4", "M4", "54", "CRI 56"], ["Garbodor M4", "M4", "55", "CRI 57"], ["Skrelp M4", "M4", "56", "CRI 58"], ["Beldum M4", "M4", "57", "CRI 59"], ["Metang M4", "M4", "58", "CRI 60"], ["Metagross M4", "M4", "59", "CRI 61"], ["Ferroseed M4", "M4", "60", "CRI 62"], ["Ferrothorn M4", "M4", "61", "CRI 63"], ["Cobalion ex M4", "M4", "62", "CRI 64"], ["Mega Dragalge ex M4", "M4", "63", "CRI 65"], ["Goomy M4", "M4", "64", "CRI 66"], ["Sliggoo M4", "M4", "65", "CRI 67"], ["Goodra M4", "M4", "66", "CRI 68"], ["Tauros M4", "M4", "67", "CRI 69"], ["Patrat M4", "M4", "68", "CRI 70"], ["Watchog M4", "M4", "69", "CRI 71"], ["Minccino M4", "M4", "70", "CRI 72"], ["Cinccino ex M4", "M4", "71", "CRI 73"], ["Special Red Card M4", "M4", "72", "CRI 82"], ["Big Catch Net M4", "M4", "73", "CRI 78"], ["Book of Transformation M4", "M4", "74", "CRI 83"], ["AZ's Tranquility M4", "M4", "75", "CRI 76"], ["Philippe M4", "M4", "76", "CRI 79"], ["Roxie's Performance M4", "M4", "77", "CRI 81"], ["Emma M4", "M4", "78", "CRI 77"], ["Hyperrogue Ange Floette M4", "M4", "79", "CRI 75"], ["Prism Tower M4", "M4", "80", "CRI 80"], ["Nitro Fire Energy M4", "M4", "81", "CRI 86"], ["Magnet Metal Energy M4", "M4", "83", "CRI 85"], ["Bubble Water Energy M4", "M4", "82", "CRI 84"], ["Transformation Tome CRI", "CRI", "83", "CRI 83"]];

function find(fullName: string): Card {
  const card = setChaosRising.find(c => c.fullName === fullName);
  expect(card).toBeDefined();
  if (!card) throw new Error('Missing playable print: ' + fullName);
  return card;
}
function battle(card: PokemonCard) {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1; opponent.id = 2;
  state.players = [player, opponent];
  player.active.cards = [card];
  const store = new Store({ onStateChange: () => {} });
  return { state, player, opponent, store };
}

describe('Chaos Rising upstream unique cards', () => {
  it('preserves every existing puzzle identity and custom English image number', () => {
    before.forEach(([fullName, set, setNumber, usSetNumber]) => {
      const card = find(fullName);
      expect([card.fullName, card.set, card.setNumber, card.usSetNumber]).toEqual([fullName, set, setNumber, usSetNumber]);
    });
  });
  [
    ['Adversity Policy CRI', '74'],
    ['Krookodile ex CRI', '55'],
    // Preserve upstream new-print fullName despite its inconsistent MEP suffix.
    ['Mega Gallade ex MEP', '48']
  ].forEach(([fullName, number]) => {
    it('registers missing upstream playable card ' + fullName, () => {
      const card = find(fullName);
      expect(card.set).toBe('CRI');
      expect(card.setNumber).toBe(number);
      expect(card.usSetNumber).toBe('CRI ' + number);
    });
  });
  it('identifies Adversity Policy as a playable Tool in the fork API', () => {
    const card = find('Adversity Policy CRI') as TrainerCard;
    expect(card.trainerType).toBe(TrainerType.TOOL);
  });
  [0, 10].forEach(damage => {
    it('applies Gale Slash bonus only when undamaged: ' + damage, () => {
      const card = find('Mega Gallade ex MEP') as PokemonCard;
      const b = battle(card);
      b.player.active.damage = damage;
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[0]);
      card.reduceEffect(b.store, b.state, effect);
      expect(effect.damage).toBe(damage === 0 ? 200 : 50);
    });
  });
  it('blocks Corner retreat through the next turn and clears at turn end', () => {
    const card = find('Krookodile ex CRI') as PokemonCard;
    const b = battle(card);
    b.opponent.active.cards = [find('Chespin M4')];
    const store = new Store({ onStateChange: () => {} });
    const attack = new AttackEffect(b.player, b.opponent, card.attacks[0]);
    card.reduceEffect(store, b.state, attack);
    expect(b.opponent.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, card)).toBe(true);
    expect(() => card.reduceEffect(store, b.state, new RetreatEffect(b.opponent, 0))).toThrow();
    card.reduceEffect(store, b.state, new EndTurnEffect(b.opponent));
    expect(b.opponent.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, card)).toBe(false);
  });
  [
    { damage: 30, weak: true, active: true, attached: true, draw: 3 },
    { damage: 0, weak: true, active: true, attached: true, draw: 0 },
    { damage: 30, weak: false, active: true, attached: true, draw: 0 },
    { damage: 30, weak: true, active: false, attached: true, draw: 0 },
    { damage: 30, weak: true, active: true, attached: false, draw: 0 }
  ].forEach((scenario, i) => {
    it('draws with Adversity Policy only for qualifying opponent Active damage: ' + i, () => {
      const policy = find('Adversity Policy CRI') as TrainerCard;
      const attacker = find(scenario.weak ? 'Mega Pyroar ex M4' : 'Froakie M4') as PokemonCard;
      const b = battle(attacker);
      b.opponent.bench = [new PokemonCardList()];
      const target = scenario.active ? b.opponent.active : b.opponent.bench[0];
      target.cards = [find('Chespin M4')];
      if (scenario.attached) target.tools = [policy];
      const deck = [find('Weedle M4'), find('Kakuna M4'), find('Carnivine M4'), find('Vulpix M4')];
      b.opponent.deck.cards = deck.slice();
      const effect = new AfterDamageEffect(new AttackEffect(b.player, b.opponent, attacker.attacks[0]), scenario.damage);
      effect.target = target;
      const store = new Store({ onStateChange: () => {} });
      policy.reduceEffect(store, b.state, effect);
      expect(b.opponent.hand.cards.length).toBe(scenario.draw);
      expect(b.opponent.deck.cards.length).toBe(4 - scenario.draw);
    });
  });
  [false, true].forEach(hasTool => {
    it('applies the printed 140 Strong Bite Tool bonus: ' + hasTool, () => {
      const card = find('Krookodile ex CRI') as PokemonCard;
      const b = battle(card);
      if (hasTool) b.player.active.tools = [find('Adversity Policy CRI') as TrainerCard];
      const effect = new AttackEffect(b.player, b.opponent, card.attacks[1]);
      card.reduceEffect(b.store, b.state, effect);
      expect(effect.damage).toBe(hasTool ? 280 : 140);
    });
  });
});

describe('Chaos Rising upstream alternate prints', () => {
  const prints: string[][] = [["Chespin IR CRI", "87", "Chespin"], ["Froakie IR CRI", "88", "Froakie"], ["Frogadier IR CRI", "89", "Frogadier"], ["Ampharos IR CRI", "90", "Ampharos"], ["Xerneas IR CRI", "91", "Xerneas"], ["Claydol IR CRI", "92", "Claydol"], ["Crobat IR CRI", "93", "Crobat"], ["Metang IR CRI", "94", "Metang"], ["Sliggoo IR CRI", "95", "Sliggoo"], ["Tauros IR CRI", "96", "Tauros"], ["Watchog IR CRI", "97", "Watchog"], ["Beedrill ex FA CRI", "98", "Beedrillex"], ["Mega Pyroar ex FA CRI", "99", "MegaPyroarex"], ["Mega Greninja ex FA CRI", "100", "MegaGreninjaex"], ["Mega Floette ex FA CRI", "101", "MegaFloetteex"], ["Gourgeist ex FA CRI", "102", "Gourgeistex"], ["Cobalion ex FA CRI", "103", "Cobalionex"], ["Mega Dragalge ex FA CRI", "104", "MegaDragalgeex"], ["Cinccino ex FA CRI", "105", "Cinccinoex"], ["AZs Tranquility FA CRI", "106", "AzsTranquility"], ["Emma FA CRI", "107", "Emma"], ["Energy Retrieval FA CRI", "108", "EnergyRetrieval"], ["Jumbo Ice Cream FA CRI", "109", "JumboIce"], ["Philippe FA CRI", "110", "Philippe"], ["Prism Tower FA CRI", "111", "PrismTower"], ["Roxies Performance FA CRI", "112", "RoxiesPerformance"], ["Special Red Card FA CRI", "113", "SpecialRedCard"], ["Surfing Beach FA CRI", "114", "SurfingBeach"], ["Tool Scrapper FA CRI", "115", "ToolScrapper"], ["Mega Greninja ex SIR CRI", "116", "MegaGreninjaex"], ["Mega Floette ex SIR CRI", "117", "MegaFloetteex"], ["Mega Dragalge ex SIR CRI", "118", "MegaDragalgeex"], ["Cinccino ex SIR CRI", "119", "Cinccinoex"], ["AZs Tranquility SIR CRI", "120", "AzsTranquility"], ["Roxies Performance SIR CRI", "121", "RoxiesPerformance"], ["Mega Greninja ex HR CRI", "122", "MegaGreninjaex"]];
  prints.forEach(([fullName, number, baseClass]) => {
    it('registers playable English alternate print ' + fullName, () => {
      const card = find(fullName);
      expect([card.set, card.setNumber, card.usSetNumber]).toEqual(['CRI', number, 'CRI ' + number]);
      const base = Object.getPrototypeOf(Object.getPrototypeOf(card));
      expect(base.constructor.name).toBe(baseClass);
      expect(card.reduceEffect).toBe(base.reduceEffect);
    });
  });
  it('keeps all fullNames and canonical set-number pairs unique', () => {
    expect(new Set(setChaosRising.map(c => c.fullName)).size).toBe(setChaosRising.length);
    expect(new Set(setChaosRising.map(c => c.set + ' ' + c.setNumber)).size).toBe(setChaosRising.length);
  });
  it('covers every numbered English Chaos Rising image print without adding renamed duplicates', () => {
    const numbers = new Set(setChaosRising.map(c => c.usSetNumber));
    for (let number = 1; number <= 122; number++) expect(numbers.has('CRI ' + number)).toBe(true);
    expect(setChaosRising.length).toBe(123); // 122 English prints plus preserved M4/Tome alias print.
    ['GreatHaulNet', 'TransformationTome', 'AngeFloette'].forEach(className => {
      expect(setChaosRising.some(c => c.constructor.name === className)).toBe(false);
    });
  });
});
