"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duosion = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Duosion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Solosis';
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Recover',
                cost: [C],
                damage: 0,
                text: 'Discard an Energy attached to this Pokémon and heal all damage from this Pokémon.'
            },
            {
                name: 'Rollout',
                cost: [P, C],
                damage: 20,
                text: ''
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Duosion';
        this.fullName = 'Duosion BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 999);
        }
        return state;
    }
}
exports.Duosion = Duosion;
