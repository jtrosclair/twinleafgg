"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strange_timepiece_1 = require("../set-mega-evolution/strange-timepiece");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Strange Timepiece MEG', () => {
    it('should leave Kadabra on top when the chain was stored out of order', () => {
        var _a;
        const game = (0, test_helpers_1.setupGame)({
            turn: 3,
            player1: {
                active: { card: 'Alakazam BS' },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const timepiece = new strange_timepiece_1.StrangeTimepiece();
        timepiece.id = 5001;
        game.player1.hand.cards.push(timepiece);
        const active = game.player1.active;
        const abra = (0, test_helpers_1.getCardByName)('Abra BS');
        const kadabra = (0, test_helpers_1.getCardByName)('Kadabra BS');
        const alakazam = active.cards[0];
        // Scrambled: Stage 1, Basic, Stage 2 — matches the reported board (Abra face-up, Kadabra "attached").
        active.cards = [kadabra, abra, alakazam];
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Strange Timepiece MEG');
        expect((_a = active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name).toBe('Kadabra');
        expect(active.getPokemons().map(p => p.name)).toEqual(['Abra', 'Kadabra']);
        expect(game.player1.hand.cards.some(c => c.name === 'Alakazam')).toBe(true);
        expect(active.pokemonPlayedTurn).toBe(game.state.turn);
    });
});
