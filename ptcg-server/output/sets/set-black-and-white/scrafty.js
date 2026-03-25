"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrafty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Scrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spit Acid',
                cost: [D],
                damage: 20,
                text: 'The Defending Pokémon is now Burned. Flip a coin. If heads, the Defending Pokémon is also Paralyzed.'
            },
            {
                name: 'High Jump Kick',
                cost: [D, D, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scrafty';
        this.fullName = 'Scrafty BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Scrafty = Scrafty;
