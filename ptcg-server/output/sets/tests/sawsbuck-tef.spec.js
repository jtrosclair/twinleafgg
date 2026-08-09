"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Sawsbuck TEF — Changing Seasons', () => {
    it('restricts the deck search to Stadium cards', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Sawsbuck TEF' },
                deck: ['Buddy-Buddy Poffin TEF', 'Perilous Jungle TEF', 'Awakening Drum TEF', ...(0, test_helpers_1.padDeck)(7, 'Buddy-Buddy Poffin TEF')]
            },
            player2: {
                active: { card: 'Great Tusk TEF' },
                deck: (0, test_helpers_1.padDeck)(10, 'Buddy-Buddy Poffin TEF')
            }
        });
        game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, (prompt, state) => {
            const chooseCardsPrompt = prompt;
            const blockedCardNames = (chooseCardsPrompt.options.blocked || [])
                .map((index) => state.players[0].deck.cards[index].fullName);
            expect(blockedCardNames).toContain('Buddy-Buddy Poffin TEF');
            expect(blockedCardNames).toContain('Awakening Drum TEF');
            expect(blockedCardNames).not.toContain('Perilous Jungle TEF');
            return [];
        });
        (0, card_test_helpers_1.useAbility)(game.store, game.state, 0, 'Changing Seasons');
    });
});
