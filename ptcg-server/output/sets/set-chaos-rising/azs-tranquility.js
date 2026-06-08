"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzsTranquility = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class AzsTranquility extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'M4';
        this.regulationMark = 'J';
        this.name = 'AZ\'s Tranquility';
        this.fullName = 'AZ\'s Tranquility M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.usSetNumber = 'CRI 75';
        this.text = 'Switch your Active Pokemon with 1 of your Benched Pokemon. If you moved a Pokemon to your Bench in this way, heal 80 damage from that Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0)
                    return state;
                const previousActive = player.active;
                player.switchPokemon(selected[0], store, state);
                const healEffect = new game_effects_1.HealEffect(player, previousActive, 80);
                return store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.AzsTranquility = AzsTranquility;
