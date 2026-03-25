"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const card_test_helpers_1 = require("./card-test-helpers");
describe('Raichu SIT — Ambushing Spark', () => {
    it('should deal 40 base damage normally', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Raichu SIT',
                    energy: ['Lightning Energy SVE']
                },
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Ambushing Spark');
        // Raichu's Ambushing Spark does 40 base when opponent hasn't used VSTAR Power
        // Weakness/resistance may apply, but Ralts is Psychic, Raichu is Lightning
        // No weakness match, so damage should be 40
        expect((0, card_test_helpers_1.getDamage)(game.state, 1, 'active')).toBe(40);
    });
    it('should deal 140 damage when opponent has used VSTAR Power', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Raichu SIT',
                    energy: ['Lightning Energy SVE']
                },
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: {
                // Use Arceus V (220 HP) so it survives 140 damage
                active: { card: 'Arceus V BRS' },
                deck: (0, test_helpers_1.padDeck)(10),
            }
        });
        // Set opponent's usedVSTAR flag
        game.player2.usedVSTAR = true;
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Ambushing Spark');
        // 40 base + 100 bonus = 140
        expect((0, card_test_helpers_1.getDamage)(game.state, 1, 'active')).toBe(140);
    });
});
