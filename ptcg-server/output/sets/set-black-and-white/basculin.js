"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basculin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Basculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Crunch',
                cost: [W, W],
                damage: 30,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Basculin';
        this.fullName = 'Basculin BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Basculin = Basculin;
