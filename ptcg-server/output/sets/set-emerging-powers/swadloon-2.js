"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swadloon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Swadloon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sewaddle';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Grass Cocooning',
                cost: [G],
                damage: 0,
                text: 'Heal 40 damage from this Pokémon.'
            },
            {
                name: 'Razor Leaf',
                cost: [G, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Swadloon';
        this.fullName = 'Swadloon EPO 6';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(40, effect, store, state);
        }
        return state;
    }
}
exports.Swadloon2 = Swadloon2;
