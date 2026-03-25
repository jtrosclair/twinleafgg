"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_actions_1 = require("../../game/store/actions/game-actions");
const energy_card_1 = require("../../game/store/card/energy-card");
const card_test_helpers_1 = require("./card-test-helpers");
const test_helpers_1 = require("./test-helpers");
describe('Test Harness Prompt Resolution', () => {
    it('should pay exact retreat cost when multiple energies are attached', () => {
        var _a;
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT', energy: ['Psychic Energy SVE', 'Water Energy SVE'] },
                bench: [{ card: 'Manaphy BRS' }],
                deck: (0, test_helpers_1.padDeck)(10)
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        const player = game.state.players[0];
        game.store.dispatch(new game_actions_1.RetreatAction(player.id, 0));
        expect(player.discard.cards.length).toBe(1);
        expect((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.fullName).toBe('Manaphy BRS');
    });
    it('should respect different energy type constraints for Mirage Gate', () => {
        const game = (0, test_helpers_1.setupGame)({
            turn: 2,
            player1: {
                active: { card: 'Ralts SIT' },
                bench: [{ card: 'Ralts SIT' }],
                hand: ['Mirage Gate LOR'],
                deck: ['Lightning Energy SVE', 'Lightning Energy SVE', 'Water Energy SVE', ...(0, test_helpers_1.padDeck)(7)]
            },
            player2: {
                active: { card: 'Ralts SIT' },
                deck: (0, test_helpers_1.padDeck)(10)
            }
        });
        for (let i = 0; i < 7; i++) {
            const card = (0, test_helpers_1.getCardByName)('Water Energy SVE');
            card.id = 9000 + i;
            game.state.players[0].lostzone.cards.push(card);
        }
        (0, card_test_helpers_1.playTrainerCard)(game.store, game.state, 0, 'Mirage Gate LOR');
        const attachedEnergy = [game.state.players[0].active, ...game.state.players[0].bench]
            .flatMap(slot => slot.energies.cards)
            .filter(card => card instanceof energy_card_1.EnergyCard);
        expect(attachedEnergy.length).toBe(2);
        const types = new Set(attachedEnergy.map(card => card.provides[0]));
        expect(types.size).toBe(2);
    });
});
