"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempleofSinnoh = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TempleofSinnoh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Temple of Sinnoh';
        this.fullName = 'Temple of Sinnoh ASR';
        this.text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide [C] Energy and have no other effect.';
    }
    reduceEffect(store, state, effect) {
        if (game_1.StateUtils.getStadiumCard(state) === this) {
            if (effect instanceof game_effects_1.UseStadiumEffect) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
            const stadiumCardList = game_1.StateUtils.findCardList(state, this);
            const stadiumOwner = game_1.StateUtils.findOwner(state, stadiumCardList);
            // Negate special energy effect when it is attached to a Pokemon
            if (effect instanceof game_effects_1.SpecialEnergyEffect) {
                const targetCard = new play_card_effects_1.TrainerTargetEffect(stadiumOwner, this, effect.attachedTo);
                store.reduceEffect(state, targetCard);
                if (targetCard.target) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
            }
            // Special energies provide [C]
            if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
                const targetCard = new play_card_effects_1.TrainerTargetEffect(stadiumOwner, this, effect.source);
                store.reduceEffect(state, targetCard);
                if (targetCard.target) {
                    effect.specialEnergiesProvideColorless = true;
                }
            }
        }
        return state;
    }
}
exports.TempleofSinnoh = TempleofSinnoh;
