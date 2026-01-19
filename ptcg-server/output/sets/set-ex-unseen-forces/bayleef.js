"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Bayleef extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chikorita';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Soothing Scent',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Razor Leaf',
                cost: [G, G, C],
                damage: 50,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Bayleef = Bayleef;
