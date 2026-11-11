import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

const batch09: Array<[string, string, string]> = [
  ["Torterra SF", "SF", "11"],
  ["Tyranitar SF", "SF", "30"],
  ["Vespiquen SF", "SF", "31"],
  ["Voltorb SF", "SF", "80"],
  ["Voltorb SF3", "SF", "SH3"],
  ["Absol G SV", "SV", "1"],
  ["Absol G LV.X SV", "SV", "141"],
  ["Arcanine G SV", "SV", "15"],
  ["Articuno SV2", "SV", "148"],
  ["Battle Tower SV", "SV", "134"],
  ["Blaziken FB SV", "SV", "2"],
  ["Blaziken FB LV.X SV", "SV", "142"],
  ["Breloom SV", "SV", "52"],
  ["Butterfree FB SV", "SV", "17"],
  ["Camerupt SV", "SV", "18"],
  ["Carnivine SV", "SV", "53"],
  ["Champion's Room SV", "SV", "135"],
  ["Charizard G SV", "SV", "20"],
  ["Chatot G SV", "SV", "54"],
  ["Cherubi SV", "SV", "96"],
  ["Chimecho SV", "SV", "21"],
  ["Chingling SV", "SV", "98"],
  ["Claydol SV", "SV", "22"],
  ["Crawdaunt G SV", "SV", "23"],
  ["Cynthia's Guidance SV", "SV", "136"],
  ["Cyrus's Initiative SV", "SV", "137"],
  ["Dewgong SV", "SV", "24"],
  ["Dodrio SV", "SV", "25"],
  ["Drifblim FB SV", "SV", "3"],
  ["Dusknoir FB SV", "SV", "26"],
  ["Electivire FB SV", "SV", "4"],
  ["Electivire FB LV.X SV", "SV", "144"],
  ["Empoleon FB SV", "SV", "27"],
  ["Exploud SV", "SV", "28"],
  ["Gabite SV", "SV", "59"],
  ["Garchomp SV", "SV", "5"],
  ["Growlithe SV", "SV", "108"],
  ["Lickilicky C SV", "SV", "30"],
  ["Lunatone SV", "SV", "32"],
  ["Magmar SV", "SV", "65"],
  ["Magmortar SV", "SV", "6"],
  ["Manectric G SV", "SV", "66"],
  ["Marshtomp SV", "SV", "67"],
  ["Masquerain SV", "SV", "68"],
  ["Mawile SV", "SV", "33"],
  ["Metagross SV", "SV", "7"],
  ["Metang SV", "SV", "69"],
  ["Milotic C SV", "SV", "35"],
  ["Milotic SV", "SV", "70"],
  ["Milotic SV2", "SV", "SH7"],
  ["Mime Jr. SV", "SV", "115"],
  ["Minun SV", "SV", "71"],
  ["Moltres SV2", "SV", "149"],
  ["Murkrow SV", "SV", "72"],
  ["Night Teleporter SV", "SV", "138"],
  ["Nincada SV", "SV", "117"],
  ["Ninjask SV", "SV", "73"],
  ["Numel SV", "SV", "74"],
  ["Parasect SV", "SV", "38"],
  ["Pinsir SV", "SV", "75"],
  ["Plusle SV", "SV", "76"],
  ["Primeape SV", "SV", "39"],
  ["Raichu SV", "SV", "77"],
  ["Raticate G SV", "SV", "78"],
  ["Rayquaza C SV", "SV", "8"],
  ["Regigigas FB SV", "SV", "9"],
  ["Relicanth SV2", "SV", "SH8"],
  ["Rhyperior SV", "SV", "10"],
  ["Roserade C SV", "SV", "40"],
  ["Rotom SV", "SV", "82"],
  ["Sableye G SV", "SV", "41"],
  ["Sandslash SV", "SV", "42"],
  ["Seaking SV", "SV", "43"],
  ["Shedinja SV", "SV", "44"],
  ["Skarmory FB SV", "SV", "83"],
  ["Solrock SV", "SV", "45"],
  ["Spinda SV", "SV", "46"],
  ["Spiritomb C SV", "SV", "84"],
  ["Staraptor FB LV.X SV", "SV", "147"],
  ["Swampert SV", "SV", "12"],
  ["Venusaur SV", "SV", "13"],
  ["Wailmer SV", "SV", "87"],
  ["Wailord SV", "SV", "47"],
  ["Yanma SV", "SV", "88"],
  ["Yanma SV2", "SV", "SH9"],
  ["Yanmega SV", "SV", "14"],
  ["Zapdos SV2", "SV", "150"],
  ["Alph Lithograph HS", "HS", "ONE"],
  ["Ampharos HS", "HS", "14"],
  ["Ampharos HS2", "HS", "105"],
  ["Ariados HS", "HS", "15"],
  ["Blissey HS2", "HS", "36"],
  ["Clefable HS", "HS", "3"],
  ["Clefairy HS", "HS", "60"],
  ["Corsola HS", "HS", "37"],
  ["Delibird HS", "HS", "39"],
  ["Dunsparce HS", "HS", "41"],
  ["Exeggutor HS", "HS", "18"],
  ["Feraligatr HS2", "HS", "20"],
  ["Flaaffy HS", "HS", "42"],
];
describe('Upstream Stormfront, Supreme Victors and HeartGold SoulSilver catalog batch 09', () => {
  for (const [fullName, set, setNumber] of batch09) {
    it('resolves ' + fullName, () => {
      const card = getCardByName(fullName);
      expect(card).toBeDefined();
      expect(card.set).toBe(set);
      expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Upstream catalog batch 09 gameplay', () => {
  it('Absol G Doom News KOs the same Defending Pokémon at the end of its next turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Absol G SV', energy: ['Darkness Energy N1', 'Water Energy SVE', 'Water Energy SVE'] }, deck: padDeck(12) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(12) },
    });
    useAttack(game.store, game.state, 0, 'Doom News');
    expect(game.player2.active.getPokemonCard()?.knockOutAtEndOfTurnPlayerId).toBe(game.player2.id);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player1));
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
    expect(game.player2.active.getPokemonCard()).toBeUndefined();
  });

  it('Relicanth SV2 raises the marked Pokémon retreat cost for its next turn only', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Relicanth SV2', energy: ['Fighting Energy SVE', 'Water Energy SVE'] }, deck: padDeck(12) },
      player2: { active: { card: 'Squirtle BS' }, deck: padDeck(12) },
    });
    const originalCost = game.player2.active.getPokemonCard()!.retreat.length;
    useAttack(game.store, game.state, 0, 'Deep Sea Pressure');
    expect(new CheckRetreatCostEffect(game.player2).cost.length).toBe(originalCost + 2);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player1));
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
    expect(new CheckRetreatCostEffect(game.player2).cost.length).toBe(originalCost);
  });

  it('resolves the upstream Staraptor FB LV.X spelling as the existing exact print', () => {
    expect(getCardByName('Staraptor FB LV.X SV').fullName).toBe('Staraptor FB Lv. X SV');
  });
});
