"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Cyrano SSP', () => {
    it('cannot be played after another Supporter in the same turn', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Cyrano SSP', 'Cyrano SSP'],
                deck: ['Pikachu ex SSP', ...(0, test_helpers_1.padDeck)(9)]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Cyrano SSP');
        expect(() => {
            (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Cyrano SSP');
        }).toThrow();
    });
});
