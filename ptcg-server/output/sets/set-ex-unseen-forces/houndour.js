"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndour = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Houndour extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smog',
                cost: [R],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'UF';
        this.name = 'Houndour';
        this.fullName = 'Houndour UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Houndour = Houndour;
