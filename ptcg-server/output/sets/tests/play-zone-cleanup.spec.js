"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const nest_ball_1 = require("../set-scarlet-and-violet/nest-ball");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Play Zone Cleanup', () => {
    it('keeps Counter Catcher in play zone while target prompt is pending, then discards after resolution', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Counter Catcher PAR'],
                deck: (0, test_helpers_1.padDeck)(10),
                prizeCount: 6
            },
            player2: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10),
                prizeCount: 5
            }
        });
        game.overridePrompt(choose_pokemon_prompt_1.ChoosePokemonPromptType, (_prompt, state) => {
            const player = state.players[0];
            expect(player.supporter.cards.some(c => c.fullName === 'Counter Catcher PAR')).toBe(true);
            return [{ player: play_card_action_1.PlayerType.TOP_PLAYER, slot: play_card_action_1.SlotType.BENCH, index: 0 }];
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Counter Catcher PAR');
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Counter Catcher PAR')).toBe(true);
        expect(game.state.players[0].supporter.cards.length).toBe(0);
    });
    it('keeps Boss\'s Orders in play zone while prompt is pending, then discards after resolution', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Boss\'s Orders PAL'],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        game.overridePrompt(choose_pokemon_prompt_1.ChoosePokemonPromptType, (_prompt, state) => {
            const player = state.players[0];
            expect(player.supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
            return [{ player: play_card_action_1.PlayerType.TOP_PLAYER, slot: play_card_action_1.SlotType.BENCH, index: 0 }];
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Boss\'s Orders PAL');
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(true);
        expect(game.state.players[0].supporter.cards.length).toBe(0);
    });
    it('supports optional end-turn supporter cleanup rule toggle', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Boss\'s Orders PAL'],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        game.state.rules.supporterCleanupAtEndTurn = true;
        game.overridePrompt(choose_pokemon_prompt_1.ChoosePokemonPromptType, (_prompt, state) => {
            const player = state.players[0];
            expect(player.supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
            return [{ player: play_card_action_1.PlayerType.TOP_PLAYER, slot: play_card_action_1.SlotType.BENCH, index: 0 }];
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Boss\'s Orders PAL');
        expect(game.state.players[0].supporter.cards.some(c => c.fullName === 'Boss\'s Orders PAL')).toBe(true);
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(false);
        (0, card_test_helpers_1.endTurn)(game.store, game.state);
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Boss\'s Orders PAL')).toBe(true);
        expect(game.state.players[0].supporter.cards.length).toBe(0);
    });
    it('keeps Nest Ball in play zone during deck prompt, then discards on completion', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Counter Catcher PAR'],
                deck: ['Manaphy BRS', ...(0, test_helpers_1.padDeck)(9)]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const placeholder = game.state.players[0].hand.cards[0];
        const nestBall = new nest_ball_1.NestBall();
        nestBall.id = placeholder.id;
        game.state.players[0].hand.cards[0] = nestBall;
        game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, (_prompt, state) => {
            const player = state.players[0];
            expect(player.supporter.cards.some(c => c.fullName === 'Nest Ball SVI')).toBe(true);
            return [0];
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Nest Ball SVI');
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Nest Ball SVI')).toBe(true);
        expect(game.state.players[0].supporter.cards.length).toBe(0);
    });
    it('keeps Ultra Ball in play zone during prompts and still discards cost cards immediately', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                hand: ['Counter Catcher PAR', 'Water Energy SVE', 'Lightning Energy SVE'],
                deck: ['Manaphy BRS', ...(0, test_helpers_1.padDeck)(9)]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const placeholder = game.state.players[0].hand.cards[0];
        const ultraBall = new ultra_ball_1.UltraBall();
        ultraBall.id = placeholder.id;
        game.state.players[0].hand.cards[0] = ultraBall;
        game.overridePrompt(choose_cards_prompt_1.ChooseCardsPromptType, (_prompt, state) => {
            const player = state.players[0];
            expect(player.supporter.cards.some(c => c.fullName === 'Ultra Ball SVI')).toBe(true);
            return [0, 1];
        });
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Ultra Ball SVI');
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Ultra Ball SVI')).toBe(true);
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Water Energy SVE')).toBe(true);
        expect((0, card_test_helpers_1.zoneContains)(game.state, 0, 'discard', 'Lightning Energy SVE')).toBe(true);
        expect(game.state.players[0].supporter.cards.length).toBe(0);
    });
});
