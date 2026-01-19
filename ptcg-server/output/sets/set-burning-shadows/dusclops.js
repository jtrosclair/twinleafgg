"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusclops = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dusclops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duskull';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Night Roam',
                cost: [P],
                damage: 0,
                text: 'Put 1 damage counter on each Pokémon (both yours and your opponent\'s).'
            },
            {
                name: 'Ambush',
                cost: [P, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Dusclops';
        this.fullName = 'Dusclops BUS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON)(1, store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Dusclops = Dusclops;
