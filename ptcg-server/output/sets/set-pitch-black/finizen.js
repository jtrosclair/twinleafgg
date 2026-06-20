"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finizen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Finizen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Drain Fin',
                cost: [W, W],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '20';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Finizen';
        this.fullName = 'Finizen M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Finizen = Finizen;
