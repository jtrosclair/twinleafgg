"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('June core safe fixes', () => {
    it('Gengar & Mimikyu-GX Horror House-GX draws only while cards remain', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Gengar & Mimikyu-GX TEU',
                    energy: ['Psychic Energy SVE', 'Psychic Energy SVE']
                },
                hand: (0, test_helpers_1.padDeck)(5),
                deck: ['Water Energy SVE']
            },
            player2: {
                active: { card: 'Arceus V BRS' },
                hand: (0, test_helpers_1.padDeck)(6),
                deck: []
            }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Horror House-GX');
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 0, 'hand')).toBe(6);
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 0, 'deck')).toBe(0);
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 1, 'hand')).toBe(6);
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 1, 'deck')).toBe(0);
    });
    it('Raichu BS evolves from Pikachu', () => {
        var _a;
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Raichu BS' },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        expect((_a = game.player1.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.evolvesFrom).toBe('Pikachu');
    });
    it('Gholdengo ex PAR Make It Rain keeps its damage after the discard prompt', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: {
                    card: 'Gholdengo ex PAR',
                    energy: ['Metal Energy SVE']
                },
                hand: ['Metal Energy SVE', 'Metal Energy SVE'],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Arceus V BRS' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Make It Rain');
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 0, 'discard')).toBe(2);
        expect((0, card_test_helpers_1.getZoneCount)(game.state, 0, 'hand')).toBe(0);
        expect(game.player2.active.damage).toBe(100);
    });
    it('Muscle Band XY modifies computed damage', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: {
                    card: 'Gholdengo ex PAR',
                    tools: ['Muscle Band XY']
                },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Arceus V BRS' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const effect = (0, card_test_helpers_1.createActiveDamageEffect)(game, 0, { damage: 0 });
        effect.damage = 100;
        game.player1.active.tools[0].reduceEffect(game.store, game.state, effect);
        expect(effect.damage).toBe(120);
    });
});
