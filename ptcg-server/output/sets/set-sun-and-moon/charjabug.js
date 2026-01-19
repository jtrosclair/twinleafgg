"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charjabug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Charjabug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grubbin';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Shocking Jaws',
                cost: [L, C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Electric Ball',
                cost: [L, C, C],
                damage: 50,
                text: ''
            },
        ];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Charjabug';
        this.fullName = 'Charjabug SUM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.Charjabug = Charjabug;
