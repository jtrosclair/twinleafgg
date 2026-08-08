"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Mega Greninja ex M4 — Mortal Shuriken', () => {
    it('accepts a Basic Water Energy returned to hand by Night Stretcher as its discard cost', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Mega Greninja ex M4' },
                hand: ['Night Stretcher SFA'],
                discard: ['Water Energy SVE'],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Night Stretcher SFA');
        game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, (prompt, state) => {
            const waterEnergy = state.players[0].hand.cards.find(card => card.fullName === 'Water Energy SVE');
            expect(waterEnergy).toBeDefined();
            expect(prompt.validate([waterEnergy], state)).toBe(true);
            game.overridePrompt(choose_pokemon_prompt_1.ChoosePokemonPromptType, () => [
                { player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.ACTIVE, index: 0 }
            ]);
            return [0];
        });
        (0, card_test_helpers_1.useAbility)(game.store, game.state, 0, 'Mortal Shuriken');
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Water Energy SVE')).toBe(true);
    });
});
