"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trubbish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trubbish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Suffocating Gas', cost: [D], damage: 10, text: '' },
            {
                name: 'Venomous Hit',
                cost: [D, C, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            },
        ];
        this.set = 'PAR';
        this.name = 'Trubbish';
        this.fullName = 'Trubbish PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Trubbish = Trubbish;
