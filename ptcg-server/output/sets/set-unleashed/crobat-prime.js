"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Golbat';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Severe Poison',
                cost: [P],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Put 4 damage counters instead of 1 on that Pokémon between turns.'
            },
            {
                name: 'Skill Dive',
                cost: [P],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Crobat';
        this.fullName = 'Crobat UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 40;
            store.reduceEffect(state, specialCondition);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state);
        }
        return state;
    }
}
exports.Crobat = Crobat;
