import * as fs from 'fs';
import * as path from 'path';
import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { AttackEffect } from '../../game/store/effects/game-effects';

// Frozen from upstream/main 2f01a5ff4; upstream/production 8e08137b5 is identical.
// Intentionally retain the M6a identities and non-contiguous 30C numbering.
const expected = [
  {"set": "30C", "setNumber": "1", "fullName": "Exeggcute 30C"},
  {"set": "30C", "setNumber": "2", "fullName": "Alolan Exeggutor 30C"},
  {"set": "30C", "setNumber": "3", "fullName": "Volbeat 30C"},
  {"set": "30C", "setNumber": "4", "fullName": "Illumise 30C"},
  {"set": "30C", "setNumber": "5", "fullName": "Tropius 30C"},
  {"set": "30C", "setNumber": "6", "fullName": "Cherubi 30C"},
  {"set": "30C", "setNumber": "7", "fullName": "Cherrim 30C"},
  {"set": "30C", "setNumber": "8", "fullName": "Vivillon 30C"},
  {"set": "30C", "setNumber": "9", "fullName": "Vulpix 30C"},
  {"set": "30C", "setNumber": "10", "fullName": "Ninetales 30C"},
  {"set": "30C", "setNumber": "11", "fullName": "Moltres 30C"},
  {"set": "30C", "setNumber": "12", "fullName": "Ho-Oh 30C"},
  {"set": "30C", "setNumber": "13", "fullName": "Victini 30C"},
  {"set": "30C", "setNumber": "14", "fullName": "Reshiram 30C"},
  {"set": "30C", "setNumber": "15", "fullName": "Fuecoco ex 30C"},
  {"set": "30C", "setNumber": "16", "fullName": "Slowpoke 30C"},
  {"set": "30C", "setNumber": "17", "fullName": "Lapras 30C"},
  {"set": "30C", "setNumber": "18", "fullName": "Articuno 30C"},
  {"set": "30C", "setNumber": "19", "fullName": "Kyogre 30C"},
  {"set": "30C", "setNumber": "22", "fullName": "Wishiwashi 30C"},
  {"set": "30C", "setNumber": "23", "fullName": "Pikachu 30C 23"},
  {"set": "30C", "setNumber": "24", "fullName": "Pikachu 30C 24"},
  {"set": "30C", "setNumber": "25", "fullName": "Pikachu 30C 25"},
  {"set": "30C", "setNumber": "26", "fullName": "Pikachu 30C 26"},
  {"set": "30C", "setNumber": "27", "fullName": "Pikachu 30C 27"},
  {"set": "30C", "setNumber": "28", "fullName": "Pikachu 30C 28"},
  {"set": "30C", "setNumber": "29", "fullName": "Pikachu 30C 29"},
  {"set": "30C", "setNumber": "30", "fullName": "Pikachu 30C 30"},
  {"set": "30C", "setNumber": "31", "fullName": "Pikachu 30C 31"},
  {"set": "30C", "setNumber": "32", "fullName": "Pikachu 30C 32"},
  {"set": "30C", "setNumber": "33", "fullName": "Pikachu 30C 33"},
  {"set": "30C", "setNumber": "34", "fullName": "Pikachu 30C 34"},
  {"set": "30C", "setNumber": "35", "fullName": "Pikachu 30C 35"},
  {"set": "30C", "setNumber": "36", "fullName": "Pikachu 30C 36"},
  {"set": "30C", "setNumber": "37", "fullName": "Pikachu 30C 37"},
  {"set": "30C", "setNumber": "38", "fullName": "Pikachu 30C 38"},
  {"set": "30C", "setNumber": "39", "fullName": "Pikachu 30C 39"},
  {"set": "30C", "setNumber": "40", "fullName": "Pikachu 30C 40"},
  {"set": "30C", "setNumber": "41", "fullName": "Pikachu 30C 41"},
  {"set": "30C", "setNumber": "42", "fullName": "Pikachu 30C 42"},
  {"set": "30C", "setNumber": "43", "fullName": "Pikachu 30C 43"},
  {"set": "30C", "setNumber": "44", "fullName": "Pikachu 30C 44"},
  {"set": "30C", "setNumber": "45", "fullName": "Pikachu 30C 45"},
  {"set": "30C", "setNumber": "46", "fullName": "Pikachu 30C 46"},
  {"set": "30C", "setNumber": "47", "fullName": "Pikachu 30C 47"},
  {"set": "30C", "setNumber": "48", "fullName": "Pikachu 30C 48"},
  {"set": "30C", "setNumber": "49", "fullName": "Pikachu 30C 49"},
  {"set": "30C", "setNumber": "50", "fullName": "Pikachu 30C 50"},
  {"set": "30C", "setNumber": "51", "fullName": "Pikachu 30C 51"},
  {"set": "30C", "setNumber": "52", "fullName": "Pikachu 30C 52"},
  {"set": "30C", "setNumber": "55", "fullName": "Zapdos 30C"},
  {"set": "30C", "setNumber": "56", "fullName": "Zekrom 30C"},
  {"set": "30C", "setNumber": "21", "fullName": "Greninja ex 30C"},
  {"set": "30C", "setNumber": "57", "fullName": "Zeraora 30C"},
  {"set": "30C", "setNumber": "58", "fullName": "Toxel 30C"},
  {"set": "30C", "setNumber": "59", "fullName": "Toxtricity 30C"},
  {"set": "30C", "setNumber": "60", "fullName": "Toxtricity 30C 60"},
  {"set": "30C", "setNumber": "61", "fullName": "Morpeko 30C"},
  {"set": "30C", "setNumber": "62", "fullName": "Miraidon 30C"},
  {"set": "30C", "setNumber": "64", "fullName": "Mewtwo 30C"},
  {"set": "30C", "setNumber": "65", "fullName": "Mew 30C"},
  {"set": "30C", "setNumber": "67", "fullName": "Marill 30C"},
  {"set": "30C", "setNumber": "68", "fullName": "Azumarill 30C"},
  {"set": "30C", "setNumber": "69", "fullName": "Espeon 30C"},
  {"set": "30C", "setNumber": "70", "fullName": "Espeon ex 30C"},
  {"set": "30C", "setNumber": "71", "fullName": "Sylveon ex 30C"},
  {"set": "30C", "setNumber": "72", "fullName": "Unown 30C"},
  {"set": "30C", "setNumber": "73", "fullName": "Drifloon 30C"},
  {"set": "30C", "setNumber": "74", "fullName": "Cresselia 30C"},
  {"set": "30C", "setNumber": "75", "fullName": "Chandelure 30C"},
  {"set": "30C", "setNumber": "76", "fullName": "Xerneas 30C"},
  {"set": "30C", "setNumber": "77", "fullName": "Comfey 30C"},
  {"set": "30C", "setNumber": "78", "fullName": "Cosmog 30C"},
  {"set": "30C", "setNumber": "79", "fullName": "Cosmoem 30C"},
  {"set": "30C", "setNumber": "80", "fullName": "Lunala 30C"},
  {"set": "30C", "setNumber": "81", "fullName": "Gimmighoul 30C"},
  {"set": "M6a", "setNumber": "57", "fullName": "Mew ex 30C"},
  {"set": "M6a", "setNumber": "55", "fullName": "Mewtwo ex 30C"},
  {"set": "30C", "setNumber": "91", "fullName": "Umbreon 30C"},
  {"set": "30C", "setNumber": "92", "fullName": "Umbreon ex 30C"},
  {"set": "30C", "setNumber": "117", "fullName": "Eevee2 30C"},
  {"set": "30C", "setNumber": "118", "fullName": "Eevee 30C 2"},
  {"set": "30C", "setNumber": "82", "fullName": "Groudon 30C"},
  {"set": "30C", "setNumber": "83", "fullName": "Lucario 30C"},
  {"set": "30C", "setNumber": "84", "fullName": "Seismitoad 30C"},
  {"set": "30C", "setNumber": "85", "fullName": "Lycanroc 30C"},
  {"set": "30C", "setNumber": "86", "fullName": "Koraidon 30C"},
  {"set": "30C", "setNumber": "87", "fullName": "Nidoran ♀ 30C"},
  {"set": "30C", "setNumber": "88", "fullName": "Nidorina 30C"},
  {"set": "30C", "setNumber": "89", "fullName": "Alolan Meowth 30C"},
  {"set": "30C", "setNumber": "90", "fullName": "Gengar ex 30C"},
  {"set": "30C", "setNumber": "93", "fullName": "Murkrow 30C"},
  {"set": "30C", "setNumber": "94", "fullName": "Scraggy 30C"},
  {"set": "30C", "setNumber": "95", "fullName": "Zorua 30C"},
  {"set": "30C", "setNumber": "96", "fullName": "Zoroark 30C"},
  {"set": "30C", "setNumber": "97", "fullName": "Deino 30C"},
  {"set": "30C", "setNumber": "98", "fullName": "Zweilous 30C"},
  {"set": "30C", "setNumber": "99", "fullName": "Hydreigon 30C"},
  {"set": "30C", "setNumber": "100", "fullName": "Yveltal 30C"},
  {"set": "30C", "setNumber": "101", "fullName": "Galarian Meowth 30C"},
  {"set": "30C", "setNumber": "102", "fullName": "Jirachi ex 30C"},
  {"set": "30C", "setNumber": "128", "fullName": "Ultra Ball 30C"},
  {"set": "30C", "setNumber": "126", "fullName": "Poké Pad 30C"},
  {"set": "30C", "setNumber": "127", "fullName": "Switch 30C"},
  {"set": "30C", "setNumber": "103", "fullName": "Dialga 30C"},
  {"set": "30C", "setNumber": "104", "fullName": "Ferrothorn 30C"},
  {"set": "30C", "setNumber": "105", "fullName": "Solgaleo 30C"},
  {"set": "30C", "setNumber": "106", "fullName": "Zacian 30C"},
  {"set": "30C", "setNumber": "107", "fullName": "Zamazenta 30C"},
  {"set": "30C", "setNumber": "108", "fullName": "Gholdengo 30C"},
  {"set": "30C", "setNumber": "109", "fullName": "Salamence ex 30C"},
  {"set": "30C", "setNumber": "110", "fullName": "Jangmo-o 30C"},
  {"set": "30C", "setNumber": "111", "fullName": "Hakamo-o 30C"},
  {"set": "30C", "setNumber": "112", "fullName": "Kommo-o 30C"},
  {"set": "30C", "setNumber": "113", "fullName": "Meowth 30C"},
  {"set": "30C", "setNumber": "114", "fullName": "Kangaskhan 30C"},
  {"set": "30C", "setNumber": "115", "fullName": "Ditto 30C"},
  {"set": "30C", "setNumber": "116", "fullName": "Eevee 30C"},
  {"set": "30C", "setNumber": "119", "fullName": "Snorlax 30C"},
  {"set": "30C", "setNumber": "120", "fullName": "Igglybuff 30C"},
  {"set": "30C", "setNumber": "121", "fullName": "Lugia 30C"},
  {"set": "30C", "setNumber": "122", "fullName": "Hisuian Zorua 30C"},
  {"set": "30C", "setNumber": "123", "fullName": "Hisuian Zoroark 30C"},
  {"set": "30C", "setNumber": "124", "fullName": "Minior 30C"},
  {"set": "30C", "setNumber": "125", "fullName": "Maushold 30C"},
  {"set": "M6a", "setNumber": "GRA", "fullName": "Grass Energy M6a"},
  {"set": "M6a", "setNumber": "FIR", "fullName": "Fire Energy M6a"},
  {"set": "M6a", "setNumber": "WAT", "fullName": "Water Energy M6a"},
  {"set": "M6a", "setNumber": "LIG", "fullName": "Lightning Energy M6a"},
  {"set": "M6a", "setNumber": "PSY", "fullName": "Psychic Energy M6a"},
  {"set": "M6a", "setNumber": "FIG", "fullName": "Fighting Energy M6a"},
  {"set": "M6a", "setNumber": "DAR", "fullName": "Darkness Energy M6a"},
  {"set": "M6a", "setNumber": "MET", "fullName": "Metal Energy M6a"},
];

function importedCards(): Card[] {
  const directory = path.resolve(__dirname, '../set-30th-celebration');
  return fs.existsSync(path.join(directory, 'index.ts'))
    ? require(directory).set30thCelebration : [];
}

const representativeSources: { [fullName: string]: [string, string] } = {
  "Cherubi 30C": ["cherubi", "Cherubi"],
  "Zeraora 30C": ["zeraora", "Zeraora"],
  "Espeon ex 30C": ["espeon-ex", "Espeonex"],
  "Mewtwo ex 30C": ["mewtwo-ex", "Mewtwoex"],
  "Umbreon ex 30C": ["umbreon-ex", "Umbreonex"],
  "Eevee2 30C": ["eevee-2", "Eevee2"],
  "Eevee 30C 2": ["other-prints", "Eevee118"],
  "Snorlax 30C": ["snorlax", "Snorlax"],
  "Igglybuff 30C": ["igglybuff", "Igglybuff"],
};

// Leaf-level behavior tests remain runnable when an unrelated upstream card
// requires a not-yet-imported engine helper. Directory coverage above stays strict.
function pokemon(fullName: string): PokemonCard {
  const [filename, className] = representativeSources[fullName];
  const modulePath = path.resolve(__dirname, '../set-30th-celebration', filename);
  if (!fs.existsSync(modulePath + '.ts')) {
    throw new Error('Missing upstream Pokémon implementation: ' + fullName);
  }
  return new (require(modulePath)[className])();
}

function battle(fullName: string) {
  const state = new State();
  const player = new Player();
  const opponent = new Player();
  player.id = 1;
  opponent.id = 2;
  state.players = [player, opponent];
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 2;
  const card = pokemon(fullName);
  player.active.cards = [card];
  opponent.active.cards = [pokemon('Snorlax 30C')];
  const store = new Store({ onStateChange: () => undefined });
  store.state = state;
  return { state, player, opponent, card, store };
}

function bench(player: Player, fullName: string) {
  const slot = new PokemonCardList();
  slot.cards = [pokemon(fullName)];
  player.bench.push(slot);
  return slot;
}

describe('30th Celebration upstream implementation coverage', () => {
  it('exports every upstream print with its exact canonical identity', () => {
    const actual = importedCards().map(c => ({ set: c.set, setNumber: c.setNumber, fullName: c.fullName }));
    expect(actual.filter(c => expected.some(e => e.fullName === c.fullName))).toEqual(expected);
    expect(actual.length).toBeGreaterThanOrEqual(133);
    expect(new Set(actual.map(c => c.fullName)).size).toBe(actual.length);
  });

  it('adapts all Pokémon types and ex tags to the fork engine', () => {
    const cards = importedCards();
    expect(cards.length).toBeGreaterThanOrEqual(133);
    cards.filter(c => c instanceof PokemonCard).forEach(c => {
      const p = c as PokemonCard;
      expect(Array.isArray(p.cardType)).toBe(false);
      expect(Object.values(CardType)).toContain(p.cardType);
      if (p.name.endsWith(' ex')) {
        expect(p.tags).toContain(CardTag.POKEMON_ex);
      }
    });
  });

  it('retains both Eevee Energy Evolution prints as executable logic', () => {
    const first = pokemon('Eevee2 30C');
    const second = pokemon('Eevee 30C 2');
    expect(second.setNumber).toBe('118');
    expect(second.powers).toEqual(first.powers);
    expect(second.reduceEffect).toBe(first.reduceEffect);
    expect(second.reduceEffect).not.toBe(Card.prototype.reduceEffect);
  });

  it('Rapid Draw moves one actual card from deck to hand', () => {
    const b = battle('Zeraora 30C');
    const drawn = pokemon('Snorlax 30C');
    b.player.deck.cards = [drawn];
    b.card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, b.card.attacks[0]));
    expect(b.player.hand.cards).toEqual([drawn]);
    expect(b.player.deck.cards).toEqual([]);
  });

  it('Lunatic Claw adds damage only against a damaged Active Pokémon', () => {
    const b = battle('Umbreon ex 30C');
    const untouched = new AttackEffect(b.player, b.opponent, b.card.attacks[0]);
    b.card.reduceEffect(b.store, b.state, untouched);
    expect(untouched.damage).toBe(100);
    b.opponent.active.damage = 10;
    const damaged = new AttackEffect(b.player, b.opponent, b.card.attacks[0]);
    b.card.reduceEffect(b.store, b.state, damaged);
    expect(damaged.damage).toBe(240);
  });

  it('Bouncy Circle counts only 30-HP Benched Pokémon', () => {
    const b = battle('Igglybuff 30C');
    bench(b.player, 'Igglybuff 30C');
    bench(b.player, 'Igglybuff 30C');
    bench(b.player, 'Snorlax 30C');
    const attack = new AttackEffect(b.player, b.opponent, b.card.attacks[0]);
    b.card.reduceEffect(b.store, b.state, attack);
    expect(attack.damage).toBe(60);
  });

  it('Photon Bullets damages opposing Pokémon ex but not regular Benched Pokémon', () => {
    const b = battle('Mewtwo ex 30C');
    b.opponent.active.cards = [pokemon('Umbreon ex 30C')];
    const ex = bench(b.opponent, 'Espeon ex 30C');
    const regular = bench(b.opponent, 'Snorlax 30C');
    b.card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, b.card.attacks[0]));
    expect(b.opponent.active.damage).toBe(50);
    expect(ex.damage).toBe(50);
    expect(regular.damage).toBe(0);
  });

  it('Psychic Powers sets the engine next-turn attack lock', () => {
    const b = battle('Mewtwo ex 30C');
    b.card.reduceEffect(b.store, b.state, new AttackEffect(b.player, b.opponent, b.card.attacks[1]));
    expect(b.player.active.cannotAttackNextTurnPending).toBe(true);
  });
});
