"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const card_test_helpers_1 = require("./card-test-helpers");
describe('Xerneas STS — Geomancy', () => {
    it('should attach Basic Fairy Energy from deck to two Benched Pokemon when Xerneas is Active', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Xerneas STS',
                    energy: ['Fairy Energy EVO']
                },
                bench: [
                    { card: 'Ralts SIT' },
                    { card: 'Ralts SIT' }
                ],
                deck: [
                    'Fairy Energy EVO',
                    'Fairy Energy EVO',
                    ...(0, test_helpers_1.padDeck)(8)
                ]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Geomancy');
        expect((0, card_test_helpers_1.getEnergyCount)(game.state, 0, 0)).toBe(1);
        expect((0, card_test_helpers_1.getEnergyCount)(game.state, 0, 1)).toBe(1);
    });
});
