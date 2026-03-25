"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tranquill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Tranquill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidove';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Glide',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Air Slash',
                cost: [C, C],
                damage: 40,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '175';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tranquill';
        this.fullName = 'Tranquill UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Air Slash
        // Ref: set-unbroken-bonds/kyurem.ts (Hail Prison - discard energy)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Tranquill = Tranquill;
