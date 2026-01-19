"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Petilil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Petilil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Spin Turn',
                cost: [G],
                damage: 10,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
            }];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Petilil';
        this.fullName = 'Petilil ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        return state;
    }
}
exports.Petilil = Petilil;
