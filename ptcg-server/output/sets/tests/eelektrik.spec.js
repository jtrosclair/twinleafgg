"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const card_test_helpers_1 = require("./card-test-helpers");
describe('Eelektrik NVI — Dynamotor', () => {
    it('should attach Lightning Energy from discard to bench', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [
                    { card: 'Eelektrik NVI' },
                    { card: 'Ralts SIT' }
                ],
                discard: ['Lightning Energy SVE'],
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        const benchEnergyBefore = (0, card_test_helpers_1.getEnergyCount)(game.state, 0, 0);
        (0, card_test_helpers_1.useAbility)(game.store, game.state, 0, 'Dynamotor');
        // Lightning Energy should have been attached to a bench Pokemon
        expect((0, card_test_helpers_1.getEnergyCount)(game.state, 0, 0)).toBeGreaterThan(benchEnergyBefore);
    });
    it('should throw error when used twice in the same turn', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [
                    { card: 'Eelektrik NVI' },
                    { card: 'Ralts SIT' }
                ],
                discard: ['Lightning Energy SVE', 'Lightning Energy SVE'],
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        // First use should succeed
        (0, card_test_helpers_1.useAbility)(game.store, game.state, 0, 'Dynamotor');
        // Second use should throw (once per turn)
        expect(() => {
            (0, card_test_helpers_1.useAbility)(game.store, game.state, 0, 'Dynamotor');
        }).toThrow();
    });
});
