"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pignite2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Pignite2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tepig';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 70,
                text: 'Discard an Energy attached to this Pokémon.'
            }];
        this.set = 'BLW';
        this.name = 'Pignite';
        this.fullName = 'Pignite BLW 18';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Pignite2 = Pignite2;
