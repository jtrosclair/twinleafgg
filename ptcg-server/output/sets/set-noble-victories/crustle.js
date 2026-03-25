"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crustle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Crustle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dwebble';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'X-Scissor',
                cost: [G, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 50 more damage.'
            }, {
                name: 'Reckless Charge',
                cost: [G, C, C],
                damage: 80,
                text: 'This Pokémon does 10 damage to itself.'
            }];
        this.set = 'NVI';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Crustle';
        this.fullName = 'Crustle NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 50);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Crustle = Crustle;
