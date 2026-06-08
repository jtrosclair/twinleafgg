"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BubbleWaterEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
class BubbleWaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.WATER];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'M4';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.usSetNumber = 'CRI 82';
        this.name = 'Bubble Water Energy';
        this.fullName = 'Bubble Water Energy M4';
        this.text = 'This card can only be attached to [W] Pokémon. The [W] Pokémon this card is attached to cannot have any Special Conditions. Remove all Special Conditions from that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, effect.player, this, effect.target)) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.WATER)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        }
        (0, prefabs_1.PREVENT_AND_CLEAR_SPECIAL_CONDITIONS)(state, effect, {
            shouldApply: (target, owner) => !!owner && target.cards.includes(this) && !(0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, owner, this, target),
        });
        return state;
    }
}
exports.BubbleWaterEnergy = BubbleWaterEnergy;
