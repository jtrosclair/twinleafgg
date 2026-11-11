import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { IS_POKEPOWER_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game/store/card/pokemon-card';

const batch03: Array<[string, string, string]> = [
  ["Arceus LV.X DPP2", "DPP", "DP56"],
  ["Dialga LV.X DPP", "DPP", "DP17"],
  ["Dialga LV.X DPP2", "DPP", "DP37"],
  ["Garchomp C LV.X DPP", "DPP", "DP46"],
  ["Giratina LV.X DPP", "DPP", "DP38"],
  ["Mewtwo LV.X DPP", "DPP", "DP28"],
  ["Dialga GE", "GE", "16"],
  ["Exploud GE", "GE", "17"],
  ["Gorebyss GE", "GE", "38"],
  ["Granbull GE", "GE", "39"],
  ["Grovyle GE", "GE", "40"],
  ["Houndoom GE", "GE", "18"],
  ["Houndour GE", "GE", "69"],
  ["Huntail GE", "GE", "42"],
  ["Hypno GE", "GE", "19"],
  ["Igglybuff GE", "GE", "70"],
  ["Jigglypuff GE", "GE", "72"],
  ["Kakuna GE", "GE", "73"],
  ["Kingler GE", "GE", "20"],
  ["Koffing GE", "GE", "74"],
  ["Lapras GE", "GE", "21"],
  ["Latias GE", "GE", "22"],
  ["Latios GE", "GE", "23"],
  ["Linoone GE", "GE", "43"],
  ["Loudred GE", "GE", "44"],
  ["Lunatone GE", "GE", "76"],
  ["Luvdisc GE", "GE", "77"],
  ["Magcargo GE", "GE", "45"],
  ["Makuhita GE", "GE", "78"],
  ["Marshtomp GE", "GE", "46"],
  ["Mawile GE", "GE", "24"],
  ["Metapod GE", "GE", "47"],
  ["Milotic GE", "GE", "25"],
  ["Pachirisu GE", "GE", "5"],
  ["Pelipper GE", "GE", "48"],
  ["Porygon-Z GE", "GE", "6"],
  ["Porygon2 GE", "GE", "49"],
  ["Primeape GE", "GE", "27"],
  ["Purugly GE", "GE", "50"],
  ["Relicanth GE", "GE", "51"],
  ["Rotom GE", "GE", "7"],
  ["Sceptile GE", "GE", "8"],
  ["Seviper GE", "GE", "52"],
  ["Skarmory GE", "GE", "53"],
  ["Slowbro GE", "GE", "54"],
  ["Slowking GE", "GE", "28"],
  ["Slowpoke GE", "GE", "82"],
  ["Solrock GE", "GE", "85"],
  ["Swampert GE", "GE", "9"],
  ["Tangela GE", "GE", "87"],
  ["Tangrowth GE", "GE", "10"],
  ["Togekiss GE", "GE", "11"],
  ["Treecko GE", "GE", "90"],
  ["Unown [F] GE", "GE", "56"],
  ["Unown [H] GE", "GE", "29"],
  ["Unown [L] GE", "GE", "91"],
  ["Wailmer GE", "GE", "58"],
  ["Wailord GE", "GE", "30"],
  ["Weezing GE", "GE", "31"],
  ["Whismur GE", "GE", "94"],
  ["Wigglytuff GE", "GE", "32"],
  ["Zigzagoon GE", "GE", "96"],
  ["Anorith LA", "LA", "46"],
  ["Armaldo LA", "LA", "18"],
  ["Beldum LA", "LA", "83"],
  ["Bellossom LA", "LA", "20"],
  ["Bellsprout LA", "LA", "85"],
  ["Bubble Coat LA", "LA", "129"],
  ["Buck's Training LA", "LA", "130"],
  ["Buneary LA", "LA", "86"],
  ["Camerupt LA", "LA", "47"],
  ["Castform Rain Form LA", "LA", "49"],
  ["Castform Snow-Cloud Form LA", "LA", "50"],
  ["Castform Sunny Form LA", "LA", "51"],
  ["Castform LA", "LA", "48"],
  ["Corphish LA", "LA", "89"],
  ["Cradily LA", "LA", "21"],
  ["Crawdaunt LA", "LA", "22"],
  ["Delcatty LA", "LA", "23"],
  ["Deoxys Attack Forme LA", "LA", "24"],
  ["Deoxys Defense Forme LA", "LA", "25"],
  ["Deoxys Normal Forme LA", "LA", "1"],
  ["Deoxys Speed Forme LA", "LA", "26"],
  ["Ditto LA", "LA", "27"],
  ["Dragonite LA", "LA", "2"],
  ["Drifblim LA", "LA", "53"],
  ["Exeggcute LA", "LA", "93"],
  ["Exeggutor LA", "LA", "54"],
  ["Forretress LA", "LA", "28"],
  ["Froslass LA", "LA", "3"],
  ["Giratina LA", "LA", "4"],
  ["Gliscor LV.X LA", "LA", "141"],
  ["Gliscor LA", "LA", "5"],
  ["Gloom LA", "LA", "96"],
  ["Gloom LA2", "LA", "97"],
  ["Groudon LA", "LA", "29"],
  ["Grumpig LA", "LA", "56"],
  ["Gulpin LA", "LA", "98"],
  ["Heatran LA", "LA", "6"],
  ["Heatran LA2", "LA", "30"],
];

describe('Upstream catalog batch 03 identities', () => {
  for (const [fullName, set, setNumber] of batch03) {
    it('resolves ' + fullName, () => {
      const card = getCardByName(fullName);
      expect(card).toBeDefined();
      expect(card.set).toBe(set);
      if (set !== 'DPP') expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Upstream Great Encounters and Legends Awakened gameplay', () => {
  it('Buneary Double Kick resolves two flips into its damage', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Buneary LA', energy: ['Water Energy SVE', 'Water Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    // Game setup also consumes random values for tracked card IDs, so keep the
    // mocked source defined throughout setup and attack resolution.
    spyOn(Math, 'random').and.returnValue(0.1);
    useAttack(game.store, game.state, 0, 'Double Kick');
    expect(game.player2.active.damage).toBe(40);
  });

  it('Bellsprout Vine Bind blocks the opponent Active Poké-Power for the next turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Bellsprout LA', energy: ['Water Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Slowking GE' }, deck: padDeck(10) },
    });
    spyOn(Math, 'random').and.returnValue(0.1);
    useAttack(game.store, game.state, 0, 'Vine Bind');
    const target = game.player2.active.getPokemonCard() as PokemonCard;
    expect(IS_POKEPOWER_BLOCKED(game.store, game.state, game.player2, target)).toBe(true);
  });
});
