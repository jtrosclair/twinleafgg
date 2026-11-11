import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, createDamageEffect } from './card-test-helpers';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEPOWER_BLOCKED } from '../../game/store/prefabs/prefabs';

const batch04: Array<[string, string, string]> = [
  ["Hitmonchan LA", "LA", "99"],
  ["Hitmonlee LA", "LA", "100"],
  ["Hitmontop LA", "LA", "101"],
  ["Horsea LA", "LA", "102"],
  ["Houndoom LA", "LA", "57"],
  ["Jirachi LA", "LA", "31"],
  ["Kingdra LA", "LA", "7"],
  ["Kyogre LA", "LA", "32"],
  ["Lanturn LA", "LA", "58"],
  ["Lanturn LA2", "LA", "59"],
  ["Ledian LA", "LA", "60"],
  ["Lileep LA", "LA", "105"],
  ["Lopunny LA", "LA", "33"],
  ["Lucario LA", "LA", "61"],
  ["Luxio LA", "LA", "62"],
  ["Luxray LA", "LA", "8"],
  ["Magnezone LV.X LA", "LA", "142"],
  ["Mamoswine LA", "LA", "9"],
  ["Marowak LA", "LA", "63"],
  ["Metagross LA", "LA", "10"],
  ["Metang LA", "LA", "64"],
  ["Mewtwo LA", "LA", "11"],
  ["Mightyena LA", "LA", "66"],
  ["Ninjask LA", "LA", "67"],
  ["Persian LA", "LA", "68"],
  ["Piloswine LA", "LA", "69"],
  ["Pineco LA", "LA", "113"],
  ["Poké Radar LA", "LA", "133"],
  ["Politoed LA", "LA", "12"],
  ["Poliwrath LA", "LA", "35"],
  ["Probopass LA", "LA", "13"],
  ["Rayquaza LA", "LA", "14"],
  ["Regigigas LA", "LA", "15"],
  ["Regigigas LA2", "LA", "37"],
  ["Registeel LA", "LA", "39"],
  ["Root Fossil LA", "LA", "139"],
  ["Seadra LA", "LA", "70"],
  ["Shedinja LA", "LA", "40"],
  ["Shinx LA", "LA", "118"],
  ["Skitty LA", "LA", "119"],
  ["Sneasel LA", "LA", "120"],
  ["Spiritomb LA", "LA", "16"],
  ["Starmie LA", "LA", "71"],
  ["Staryu LA", "LA", "122"],
  ["Swalot LA", "LA", "72"],
  ["Swellow LA", "LA", "73"],
  ["Swinub LA", "LA", "123"],
  ["Taillow LA", "LA", "124"],
  ["Tauros LA", "LA", "74"],
  ["Technical Machine TS-1 LA", "LA", "136"],
  ["Technical Machine TS-2 LA", "LA", "137"],
  ["Tentacool LA", "LA", "125"],
  ["Tentacruel LA", "LA", "75"],
  ["Torkoal LA", "LA", "41"],
  ["Tyrogue LA", "LA", "126"],
  ["Unown [J] LA", "LA", "76"],
  ["Unown [U] LA", "LA", "78"],
  ["Unown [V] LA", "LA", "79"],
  ["Unown [W] LA", "LA", "80"],
  ["Unown [Y] LA", "LA", "81"],
  ["Unown [?] LA", "LA", "82"],
  ["Victreebel LA", "LA", "44"],
  ["Vileplume LA", "LA", "45"],
  ["Yanma LA", "LA", "128"],
  ["Yanmega LA", "LA", "17"],
  ["Aerodactyl MD", "MD", "15"],
  ["Aipom MD", "MD", "50"],
  ["Ambipom MD", "MD", "35"],
  ["Articuno MD", "MD", "1"],
  ["Chimchar MD2", "MD", "57"],
  ["Chingling MD", "MD", "58"],
  ["Combee MD", "MD", "59"],
  ["Cresselia MD", "MD", "2"],
  ["Dawn Stadium MD", "MD", "79"],
  ["Dialga MD", "MD", "4"],
  ["Dome Fossil MD", "MD", "89"],
  ["Drifloon MD", "MD", "61"],
  ["Eevee MD2", "MD", "63"],
  ["Electrike MD", "MD", "64"],
  ["Espeon MD", "MD", "18"],
  ["Flareon MD", "MD", "19"],
  ["Garchomp LV.X MD", "MD", "97"],
  ["Glaceon LV.X MD", "MD", "98"],
  ["Glaceon MD", "MD", "5"],
  ["Glameow MD", "MD", "65"],
  ["Grotle MD", "MD", "37"],
  ["Health Energy MD", "MD", "94"],
  ["Helix Fossil MD", "MD", "91"],
  ["Hippowdon MD", "MD", "21"],
  ["Infernape MD", "MD", "22"],
  ["Jolteon MD", "MD", "23"],
  ["Kabuto MD", "MD", "67"],
  ["Kabutops MD", "MD", "6"],
  ["Leafeon LV.X MD", "MD", "99"],
  ["Leafeon MD", "MD", "7"],
  ["Manaphy MD", "MD", "8"],
  ["Manectric MD", "MD", "40"],
  ["Mewtwo MD", "MD", "9"],
  ["Minun MD", "MD", "25"],
  ["Moltres MD", "MD", "10"],
];

describe('Upstream Legends Awakened and Majestic Dawn catalog batch 04 identities', () => {
  for (const [fullName, set, setNumber] of batch04) {
    it('resolves ' + fullName, () => {
      const card = getCardByName(fullName);
      expect(card).toBeDefined();
      expect(card.set).toBe(set);
      expect(card.setNumber).toBe(setNumber);
    });
  }
});

describe('Upstream batch 04 gameplay compatibility', () => {
  it('Hitmonchan Counter Punch retaliates across the opponent attack', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Hitmonchan LA', energy: ['Fighting Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Counter Punch');
    const incoming = createDamageEffect(game, 1, { damage: 30 });
    game.store.reduceEffect(game.state, incoming);
    expect(game.player1.active.damage).toBe(50);
    expect(game.player2.active.damage).toBe(40);
  });

  it('Jirachi Doom Desire knocks out the marked Active after the opponent turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Jirachi LA', energy: ['Metal Energy SVE', 'Metal Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Doom Desire');
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player1));
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
    expect(game.player2.active.cards.length).toBe(0);
  });

  it('Glaceon LV.X Chilly Breath blocks the opponent Active Poké-Power', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Glaceon LV.X MD' }, deck: padDeck(10) },
      player2: { active: { card: 'Slowking GE' }, deck: padDeck(10) },
    });
    expect(IS_POKEPOWER_BLOCKED(game.store, game.state, game.player2, game.player2.active.getPokemonCard()!)).toBe(true);
  });

  it('Garchomp LV.X Restore returns a Basic Pokémon from the discard to the Bench', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Garchomp LV.X MD' }, discard: ['Turtwig MD'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) },
    });
    useAttack(game.store, game.state, 0, 'Restore');
    expect(game.player1.discard.cards.some(card => card.fullName === 'Turtwig MD')).toBe(false);
    expect(game.player1.bench.some(slot => slot.getPokemonCard()?.fullName === 'Turtwig MD')).toBe(true);
  });
});
