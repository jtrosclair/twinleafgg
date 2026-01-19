"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magcargo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magcargo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slugma';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Heat Blast',
                cost: [R, C, C],
                damage: 60,
                text: ''
            },
            {
                name: 'Bright Flame',
                cost: [R, R, C, C],
                damage: 180,
                text: 'Discard 2 Energy from this Pokémon.'
            }];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Magcargo';
        this.fullName = 'Magcargo VIV';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Magcargo = Magcargo;
