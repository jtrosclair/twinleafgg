"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IslandCave = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class IslandCave extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'HL';
        this.name = 'Island Cave';
        this.fullName = 'Island Cave HL';
        this.text = 'Whenever any player attaches an Energy card from his or hand to [W] Pokémon, [F] Pokémon, or [M] Pokémon, remove any Special Conditions from that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER) ||
                checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING) ||
                checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
                effect.target.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
            }
        }
        return state;
    }
}
exports.IslandCave = IslandCave;
