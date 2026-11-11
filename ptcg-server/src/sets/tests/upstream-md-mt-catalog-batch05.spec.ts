import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, createDamageEffect } from './card-test-helpers';

const batch05: Array<[string, string, string]> = [
  ["Mom's Kindness MD", "MD", "83"],
  ["Mothim MD", "MD", "42"],
  ["Munchlax MD", "MD", "68"],
  ["Old Amber MD", "MD", "84"],
  ["Omanyte MD", "MD", "69"],
  ["Omastar MD", "MD", "26"],
  ["Energy Restore MD", "MD", "81"],
  ["Fossil Excavator MD", "MD", "82"],
  ["Pachirisu MD", "MD", "43"],
  ["Palkia MD", "MD", "11"],
  ["Phione MD", "MD", "12"],
  ["Phione MD2", "MD", "27"],
  ["Piplup MD2", "MD", "72"],
  ["Porygon-Z LV.X MD", "MD", "100"],
  ["Raichu MD", "MD", "45"],
  ["Recover Energy MD", "MD", "96"],
  ["Rotom MD", "MD", "13"],
  ["Torterra MD", "MD", "30"],
  ["Turtwig MD2", "MD", "78"],
  ["Umbreon MD", "MD", "32"],
  ["Vaporeon MD", "MD", "34"],
  ["Zapdos MD", "MD", "14"],
  ["Abomasnow MT", "MT", "19"],
  ["Abra MT", "MT", "69"],
  ["Aggron MT", "MT", "1"],
  ["Aipom MT", "MT", "70"],
  ["Alakazam MT", "MT", "2"],
  ["Ambipom MT", "MT", "3"],
  ["Ariados MT", "MT", "20"],
  ["Armor Fossil MT", "MT", "116"],
  ["Barboach MT", "MT", "72"],
  ["Bastiodon MT", "MT", "21"],
  ["Blissey MT", "MT", "5"],
  ["Bronzong MT", "MT", "6"],
  ["Buizel MT", "MT", "75"],
  ["Celebi MT", "MT", "7"],
  ["Chingling MT", "MT", "42"],
  ["Cranidos MT", "MT", "43"],
  ["Croagunk MT", "MT", "78"],
  ["Crobat MT", "MT", "23"],
  ["Dewgong MT", "MT", "45"],
  ["Dodrio MT", "MT", "46"],
  ["Electivire LV.X MT", "MT", "121"],
  ["Electrike MT", "MT", "81"],
  ["Exeggcute MT", "MT", "82"],
  ["Exeggutor MT", "MT", "24"],
  ["Feraligatr MT", "MT", "8"],
  ["Fossil Excavator MT", "MT", "111"],
  ["Geodude MT", "MT", "84"],
  ["Glalie MT", "MT", "25"],
  ["Graveler MT", "MT", "51"],
  ["Gyarados MT", "MT", "26"],
  ["Happiny MT", "MT", "52"],
  ["Honchkrow MT", "MT", "10"],
  ["Lairon MT", "MT", "53"],
  ["Lake Boundary MT", "MT", "112"],
  ["Larvitar MT", "MT", "87"],
  ["Lumineon MT", "MT", "11"],
  ["Magby MT", "MT", "88"],
  ["Magmar MT", "MT", "54"],
  ["Magmortar LV.X MT", "MT", "123"],
  ["Magmortar MT", "MT", "12"],
  ["Manectric MT", "MT", "28"],
  ["Mantine MT", "MT", "29"],
  ["Masquerain MT", "MT", "55"],
  ["Meganium MT", "MT", "13"],
  ["Mr. Mime MT", "MT", "30"],
  ["Nidoqueen MT", "MT", "31"],
  ["Ninetales MT", "MT", "32"],
  ["Octillery MT", "MT", "57"],
  ["Parasect MT", "MT", "58"],
  ["Pichu MT", "MT", "93"],
  ["Pikachu MT", "MT", "94"],
  ["Pupitar MT", "MT", "59"],
  ["Quilava MT", "MT", "60"],
  ["Raichu MT", "MT", "15"],
  ["Rampardos MT", "MT", "33"],
  ["Remoraid MT", "MT", "95"],
  ["Sandshrew MT", "MT", "96"],
  ["Sandslash MT", "MT", "61"],
  ["Sealeo MT", "MT", "62"],
  ["Shieldon MT", "MT", "63"],
  ["Shinx MT", "MT", "98"],
  ["Skull Fossil MT", "MT", "117"],
  ["Slaking MT", "MT", "34"],
  ["Spheal MT", "MT", "102"],
  ["Sudowoodo MT", "MT", "35"],
  ["Surskit MT", "MT", "104"],
  ["Toxicroak MT", "MT", "36"],
  ["Tropius MT", "MT", "64"],
  ["Typhlosion MT", "MT", "16"],
  ["Tyranitar MT", "MT", "17"],
  ["Unown [I] MT", "MT", "37"],
  ["Unown [M] MT", "MT", "66"],
  ["Unown [T] MT", "MT", "67"],
  ["Ursaring MT", "MT", "38"],
  ["Uxie MT", "MT", "18"],
  ["Vigoroth MT", "MT", "68"],
  ["Walrein MT", "MT", "39"],
  ["Whiscash MT", "MT", "40"],
];

describe('Upstream Majestic Dawn and Mysterious Treasures catalog batch 05 identities', () => {
  for (const [fullName, set, setNumber] of batch05) {
    it('resolves ' + fullName, () => {
      const card = getCardByName(fullName);
      expect(card).toBeDefined();
      expect(card.set).toBe(set);
      expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Upstream batch 05 gameplay compatibility', () => {
  it('Alakazam Psychic Guard filters incoming attacks to Stage 2 attackers', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Alakazam MT', energy: ['Psychic Energy SVE', 'Psychic Energy SVE', 'Psychic Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Meganium MT' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Psychic Guard');
    const incoming = createDamageEffect(game, 1, { damage: 50 });
    game.store.reduceEffect(game.state, incoming);
    expect(game.player1.active.damage).toBe(20);
  });

  it('Ursaring Bad Temper raises the affected Active Pokémon attack damage next turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Ursaring MT', energy: ['Fire Energy SVE', 'Fire Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Bad Temper');
    const incoming = createDamageEffect(game, 1, { damage: 30 });
    game.store.reduceEffect(game.state, incoming);
    expect(game.player1.active.damage).toBe(90);
  });

  it('Manectric Chain Lightning only damages benched Pokémon sharing the Defending type', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Manectric MT', energy: ['Lightning Energy SVE', 'Lightning Energy SVE', 'Lightning Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Pikachu MT' }, bench: [{ card: 'Raichu MT' }, { card: 'Whiscash MT' }], deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Chain Lightning');
    // The Active Pikachu is knocked out by Chain Lightning's printed 70, so
    // the damaged matching-type Raichu is promoted before assertions run.
    expect(game.player2.active.getPokemonCard()?.fullName).toBe('Raichu MT');
    expect(game.player2.active.damage).toBe(20);
    expect(game.player2.bench[1].damage).toBe(0);
  });
});
