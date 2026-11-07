"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('August 2026 safe engine and card fixes', () => {
    it('clears all effects from the Pokémon that leaves the Active Spot', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const leavingActive = game.player1.active;
        const activeCard = leavingActive.getPokemonCard();
        if (!activeCard) {
            throw new Error('Expected an Active Pokémon');
        }
        leavingActive.marker.addMarker('temporary-effect', activeCard, 'ability');
        game.player1.switchPokemon(game.player1.bench[0]);
        expect(game.player1.bench[0].marker.markers).toEqual([]);
    });
    it('puts a discarded non-Basic Fire Pokémon onto the Bench with Spirit Burner', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Chandelure UNM', energy: ['Fire Energy SVE'] },
                deck: ['Chandelure UNM', ...(0, test_helpers_1.padDeck)(4)]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Spirit Burner');
        expect(game.player1.bench.some(slot => { var _a; return ((_a = slot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.fullName) === 'Chandelure UNM'; })).toBe(true);
    });
    it('registers Pumpkaboo XY as a Psychic Pokémon', () => {
        const pumpkaboo = (0, test_helpers_1.getCardByName)('Pumpkaboo XY');
        if (!(pumpkaboo instanceof pokemon_card_1.PokemonCard)) {
            throw new Error('Expected Pumpkaboo XY to be a Pokémon card');
        }
        expect(pumpkaboo.cardType).toBe(card_types_1.CardType.PSYCHIC);
    });
});
