"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const windup_arm_1 = require("../set-lost-origin/windup-arm");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('July safe card fixes', () => {
    it("leaves exactly two cards in hand after Lillie's Full Force CEC resolves at end of turn", () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: [
                    "Lillie's Full Force CEC",
                    'Water Energy SVE',
                    'Water Energy SVE'
                ],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, "Lillie's Full Force CEC");
        (0, card_test_helpers_1.endTurn)(game.store, game.state);
        expect(game.player1.hand.cards.length).toBe(2);
    });
    it('makes Windup Arm LOR a Tool that scopes the status exception to its UseAttackEffect', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const windupArm = new windup_arm_1.WindupArm();
        game.player1.active.tools.push(windupArm);
        const attack = game.player1.active.getPokemonCard().attacks[0];
        const useAttackEffect = new game_effects_1.UseAttackEffect(game.player1, attack);
        const attackEffect = new game_effects_1.AttackEffect(game.player1, game.player2, attack);
        windupArm.reduceEffect(game.store, game.state, useAttackEffect);
        windupArm.reduceEffect(game.store, game.state, attackEffect);
        expect(windupArm.trainerType).toBe(card_types_1.TrainerType.TOOL);
        expect(windupArm.setNumber).toBe('170');
        expect(windupArm.fullName).toBe('Windup Arm LOR 170');
        expect(useAttackEffect.ignoreStatusConditions).toBe(true);
        expect(attackEffect.ignoreStatusConditions).toBeUndefined();
    });
    it('allows Windup Arm LOR attached to an Asleep Active to attack', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const windupArm = new windup_arm_1.WindupArm();
        game.player1.active.tools.push(windupArm);
        game.player1.active.specialConditions.push(card_types_1.SpecialCondition.ASLEEP);
        (0, card_test_helpers_1.useAttack)(game.store, game.state, 0, 'Ambushing Spark');
        expect(game.player2.active.damage).toBe(40);
    });
});
