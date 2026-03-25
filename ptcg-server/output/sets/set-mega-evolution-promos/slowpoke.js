"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Aloof Face',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokemon can\'t be Confused.'
            }];
        this.attacks = [{
                name: 'Super Psy',
                cost: [P, P, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEP';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke MEP';
    }
    reduceEffect(store, state, effect) {
        // Aloof Face - prevent confusion
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect || effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
            if (effect.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED)) {
                const targetCard = effect.target.getPokemonCard();
                if (targetCard === this) {
                    effect.preventDefault = true;
                }
            }
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
