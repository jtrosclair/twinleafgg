"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianGrowlithe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianGrowlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Singe',
                cost: [],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'LOR';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'F';
        this.name = 'Hisuian Growlithe';
        this.fullName = 'Hisuian Growlithe LOR';
    }
    reduceEffect(store, state, effect) {
        // Singe
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.HisuianGrowlithe = HisuianGrowlithe;
