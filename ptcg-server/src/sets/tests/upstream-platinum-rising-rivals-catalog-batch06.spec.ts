import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, createDamageEffect } from './card-test-helpers';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

const batch06: Array<[string, string, string]> = [
  ["Altaria PL", "PL", "18"],
  ["Ampharos PL", "PL", "1"],
  ["Armor Fossil PL", "PL", "119"],
  ["Banette PL", "PL", "19"],
  ["Bastiodon PL", "PL", "20"],
  ["Beautifly PL", "PL", "21"],
  ["Blastoise PL", "PL", "2"],
  ["Blaziken PL", "PL", "3"],
  ["Blissey PL", "PL", "22"],
  ["Cacnea PL", "PL", "67"],
  ["Cacturne PL", "PL", "42"],
  ["Carnivine PL", "PL", "43"],
  ["Cascoon PL", "PL", "44"],
  ["Cyrus's Conspiracy PL", "PL", "105"],
  ["Dialga PL2", "PL", "6"],
  ["Dialga PL3", "PL", "23"],
  ["Diglett PL", "PL", "72"],
  ["Drapion LV.X PL", "PL", "123"],
  ["Dugtrio PL", "PL", "24"],
  ["Dunsparce PL", "PL", "73"],
  ["Dustox PL", "PL", "25"],
  ["Empoleon PL", "PL", "26"],
  ["Flaaffy PL", "PL", "48"],
  ["Gardevoir PL", "PL", "8"],
  ["Giratina PL2", "PL", "10"],
  ["Giratina PL3", "PL", "27"],
  ["Giratina PL4", "PL", "28"],
  ["Golduck PL", "PL", "29"],
  ["Gyarados G PL", "PL", "30"],
  ["Happiny PL", "PL", "76"],
  ["Honchkrow G PL", "PL", "77"],
  ["Houndoom G PL", "PL", "50"],
  ["Infernape PL", "PL", "31"],
  ["Lickilicky PL", "PL", "33"],
  ["Lickitung PL", "PL", "80"],
  ["Lombre PL", "PL", "52"],
  ["Lotad PL", "PL", "81"],
  ["Lotad PL2", "PL", "SH4"],
  ["Lucario PL", "PL", "53"],
  ["Ludicolo PL", "PL", "34"],
  ["Luvdisc PL", "PL", "35"],
  ["Manectric PL", "PL", "11"],
  ["Memory Berry PL", "PL", "110"],
  ["Miasma Valley PL", "PL", "111"],
  ["Mightyena PL", "PL", "54"],
  ["Mismagius PL", "PL", "55"],
  ["Monferno PL", "PL", "56"],
  ["Muk PL", "PL", "57"],
  ["Ninetales PL", "PL", "36"],
  ["Octillery PL", "PL", "58"],
  ["Palkia PL", "PL", "37"],
  ["Probopass PL", "PL", "60"],
  ["Psyduck PL", "PL", "87"],
  ["Purugly G PL", "PL", "88"],
  ["Rampardos PL", "PL", "13"],
  ["Shaymin LV.X PL", "PL", "126"],
  ["Shaymin PL2", "PL", "15"],
  ["Shieldon PL", "PL", "62"],
  ["Shuppet PL", "PL", "92"],
  ["Silcoon PL", "PL", "63"],
  ["Skull Fossil PL", "PL", "120"],
  ["Slaking PL", "PL", "16"],
  ["Slakoth PL", "PL", "95"],
  ["Swablu PL2", "PL", "SH5"],
  ["Team Galactic's Invention G-103 Power Spray PL", "PL", "117"],
  ["Torchic PL", "PL", "99"],
  ["Torkoal PL", "PL", "100"],
  ["Toxicroak G PL", "PL", "40"],
  ["Vulpix PL2", "PL", "SH6"],
  ["Wartortle PL", "PL", "65"],
  ["Weavile G PL", "PL", "17"],
  ["Zangoose PL", "PL", "66"],
  ["Aerodactyl GL RR", "RR", "55"],
  ["Aggron RR", "RR", "14"],
  ["Alakazam E4 LV.X RR", "RR", "103"],
  ["Alakazam E4 RR", "RR", "38"],
  ["Arcanine RR", "RR", "1"],
  ["Bertha's Warmth RR", "RR", "90"],
  ["Bronzong E4 RR", "RR", "16"],
  ["Carvanha RR", "RR", "58"],
  ["Charon's Choice RR", "RR", "RT6"],
  ["Darkrai G RR", "RR", "3"],
  ["Electrode G RR", "RR", "39"],
  ["Espeon E4 RR", "RR", "18"],
  ["Fan Rotom RR", "RR", "RT1"],
  ["Flareon E4 RR", "RR", "60"],
  ["Flareon RR", "RR", "19"],
  ["Flint's Willpower RR", "RR", "91"],
  ["Flygon LV.X RR", "RR", "105"],
  ["Flygon RR", "RR", "5"],
  ["Flying Pikachu RR", "RR", "113"],
  ["Forretress G RR", "RR", "61"],
  ["Froslass GL RR", "RR", "6"],
  ["Frost Rotom RR", "RR", "RT2"],
  ["Gallade E4 LV.X RR", "RR", "106"],
  ["Gallade E4 RR", "RR", "20"],
  ["Gastrodon East Sea RR", "RR", "21"],
  ["Gastrodon West Sea RR", "RR", "22"],
  ["Gengar GL RR", "RR", "40"],
  ["Glaceon RR", "RR", "41"],
];

describe('Upstream Platinum and Rising Rivals catalog batch 06 identities', () => {
  for (const [fullName, set, setNumber] of batch06) {
    it('resolves ' + fullName, () => {
      const card = getCardByName(fullName);
      expect(card).toBeDefined();
      expect(card.set).toBe(set);
      expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Upstream batch 06 gameplay compatibility', () => {
  it('Aerodactyl GL Primal Breath blocks the Defending Pokémon from evolving next turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Aerodactyl GL RR', energy: ['Fighting Energy SVE', 'Water Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Pikachu MT' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Primal Breath');
    expect(game.player2.active.cannotEvolveNextTurn).toBe(true);
  });

  it('Bronzong E4 Hand Refresh shuffles and draws for each player in order', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Bronzong E4 RR' }, hand: ['Fire Energy SVE'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, hand: ['Water Energy SVE'], deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Hand Refresh');
    expect(game.player1.hand.cards.length).toBe(4);
    // Passing the attack ends the turn, so the opponent also takes the normal
    // start-of-turn draw after shuffling and drawing up to four.
    expect(game.player2.hand.cards.length).toBe(5);
    expect(game.player1.deck.cards.length).toBe(7);
    expect(game.player2.deck.cards.length).toBe(6);
  });

  it('Carvanha Scary Face applies the next-turn attack and retreat restrictions', () => {
    // CoinFlipEffect uses the game reducer's RNG, not the prompt arbiter.
    spyOn(Math, 'random').and.returnValue(0);
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Carvanha RR', energy: ['Water Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Scary Face');
    expect(game.player2.active.cannotAttackNextTurnPending).toBe(true);
    expect(game.player2.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER)).toBe(true);
  });

  it('Gardevoir Psychic Protection removes Weakness from incoming attacks for the next turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Gardevoir PL', energy: ['Psychic Energy SVE', 'Water Energy SVE', 'Water Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Psychic Protection');
    const incoming = createDamageEffect(game, 1, { damage: 50 });
    game.store.reduceEffect(game.state, incoming);
    expect(game.player1.active.damage).toBe(50);
  });
});
