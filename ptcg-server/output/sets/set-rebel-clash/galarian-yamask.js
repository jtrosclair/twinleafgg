"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianYamask = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianYamask extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'D';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Reckless Charge',
                cost: [C, C],
                damage: 50,
                text: 'This Pokémon also does 30 damage to itself.'
            },
        ];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Galarian Yamask';
        this.fullName = 'Galarian Yamask RCL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.GalarianYamask = GalarianYamask;
