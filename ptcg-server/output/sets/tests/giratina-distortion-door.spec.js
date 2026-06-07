"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_actions_1 = require("../../game/store/actions/game-actions");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
function dispatchDistortionDoor(game, index) {
    const player = game.state.players[0];
    game.store.dispatch(new game_actions_1.UseAbilityAction(player.id, 'Distortion Door', {
        player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.DISCARD, index
    }));
}
describe('Giratina LOT — Distortion Door (multiple copies)', () => {
    it('activates all 4 Giratina from discard in one turn (correct indices)', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                discard: ['Giratina LOT', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT'],
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const player = game.state.players[0];
        for (let i = 0; i < 4; i++) {
            const index = player.discard.cards.findIndex((c) => c instanceof pokemon_card_1.PokemonCard && c.powers.some((p) => p.name === 'Distortion Door'));
            dispatchDistortionDoor(game, index);
        }
        expect(player.bench.filter((b) => b.cards.length > 0).length).toBe(4);
    });
    it('activates all 4 even when the client sends STALE discard indices', () => {
        const game = (0, test_helpers_1.setupGame)({
            player1: {
                active: { card: 'Ralts SIT' },
                // A non-Giratina Pokemon precedes the Giratina, like a real discard pile.
                discard: ['Exeggcute PLF', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT', 'Giratina LOT'],
                deck: (0, test_helpers_1.padDeck)(10),
            },
            player2: { active: { card: 'Ralts SIT' }, deck: (0, test_helpers_1.padDeck)(10) }
        });
        const player = game.state.players[0];
        // Client computed these once from the original pile and never refreshed.
        // After each Giratina leaves, the pile shrinks and these point at the wrong card.
        const staleIndices = [1, 2, 3, 4];
        for (const index of staleIndices) {
            dispatchDistortionDoor(game, index);
        }
        expect(player.bench.filter((b) => b.cards.length > 0).length).toBe(4);
        // The non-Giratina card stays in the discard.
        expect(player.discard.cards.length).toBe(1);
    });
});
