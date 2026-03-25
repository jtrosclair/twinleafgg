"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const card_test_helpers_1 = require("./card-test-helpers");
describe('Electric Generator PAF', () => {
    it('should attach Lightning Energy from top of deck to benched Lightning Pokemon', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Eelektrik NVI' }],
                hand: ['Electric Generator PAF'],
                deck: [
                    'Lightning Energy SVE',
                    'Lightning Energy SVE',
                    'Water Energy SVE',
                    'Water Energy SVE',
                    'Water Energy SVE',
                    ...(0, test_helpers_1.padDeck)(5),
                ],
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        const benchEnergyBefore = (0, card_test_helpers_1.getEnergyCount)(game.state, 0, 0);
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Electric Generator PAF');
        // Should have attached Lightning Energy to the benched Eelektrik
        expect((0, card_test_helpers_1.getEnergyCount)(game.state, 0, 0)).toBeGreaterThan(benchEnergyBefore);
    });
    it('should not be playable without Lightning Pokemon on bench', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Ralts SIT' }],
                hand: ['Electric Generator PAF'],
                deck: [
                    'Lightning Energy SVE',
                    'Lightning Energy SVE',
                    ...(0, test_helpers_1.padDeck)(8),
                ],
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        // Should throw because there's no Lightning Pokemon on bench
        expect(() => {
            (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Electric Generator PAF');
        }).toThrow();
    });
});
