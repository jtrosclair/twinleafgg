"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerPlant = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class PowerPlant extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'UNB';
        this.name = 'Power Plant';
        this.fullName = 'Power Plant UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '183';
        this.text = 'Pokémon-GX and Pokémon-EX in play (both yours and your opponent\'s) have no Abilities.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.card;
            const isEXorGX = pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_GX) || pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_EX);
            if (!effect.power.exemptFromAbilityLock) {
                if (isEXorGX && pokemonCard.powers.some(power => power.powerType === game_1.PowerType.ABILITY)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.PowerPlant = PowerPlant;
