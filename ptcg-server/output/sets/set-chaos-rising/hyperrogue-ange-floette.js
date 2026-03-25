"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperrogueAngeFloette = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class HyperrogueAngeFloette extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'M4';
        this.setNumber = '79';
        this.name = 'Hyperrogue Ange Floette';
        this.fullName = 'Hyperrogue Ange Floette M4';
        this.cardImage = 'assets/cardback.png';
        this.text = 'You may play this card only if Prism Tower is in play. Each Mega Floette ex in play gets +150 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.trainerCard === this) {
            const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
            if (!stadiumCard || stadiumCard.name !== 'Prism Tower') {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof check_effects_1.CheckHpEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard
                && pokemonCard.name === 'Mega Floette ex'
                && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA)) {
                effect.hp += 150;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.HyperrogueAngeFloette = HyperrogueAngeFloette;
