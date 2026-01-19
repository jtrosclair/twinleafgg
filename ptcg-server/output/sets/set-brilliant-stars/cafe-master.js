"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CafeMaster = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CafeMaster extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'E';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.name = 'Café Master';
        this.fullName = 'Café Master BRS';
        this.text = 'Choose up to 3 of your Benched Pokémon. For each of those Pokémon, search your deck for a different type of basic Energy card and attach it to that Pokémon. Then, shuffle your deck. Your turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if supporter was already played this turn
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Move card to supporter area and prevent default discard
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Prompt player to attach energy cards
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, differentTargets: true }), transfers => {
                transfers = transfers || [];
                // Validate energy type selection if multiple cards chosen
                if (transfers.length > 1) {
                    const cardNames = new Set();
                    for (const transfer of transfers) {
                        if (cardNames.has(transfer.card.name)) {
                            throw new game_1.GameError(game_message_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                        }
                        cardNames.add(transfer.card.name);
                    }
                }
                // Attach energy cards to targets
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                // Always shuffle deck after energy attachment (or no attachment)
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
            // Move supporter card to discard pile
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            // Check if we should end turn based on active Pokemon
            const playerActive = player.active.getPokemonCard();
            if (playerActive &&
                playerActive.fullName !== 'Alcremie BRS' &&
                !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, playerActive)) {
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                return store.reduceEffect(state, endTurnEffect);
            }
        }
        return state;
    }
}
exports.CafeMaster = CafeMaster;
