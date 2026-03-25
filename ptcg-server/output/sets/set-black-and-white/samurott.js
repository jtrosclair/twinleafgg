"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Samurott = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Samurott extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dewott';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Pike',
                cost: [C, C],
                damage: 30,
                text: 'Does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Surf',
                cost: [W, W, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Samurott';
        this.fullName = 'Samurott BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
        }
        return state;
    }
}
exports.Samurott = Samurott;
