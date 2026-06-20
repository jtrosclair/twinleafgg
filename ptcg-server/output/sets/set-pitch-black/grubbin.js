"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grubbin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Grubbin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'String Shot',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.',
            }];
        this.set = 'M5';
        this.setNumber = '2';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Grubbin';
        this.fullName = 'Grubbin M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, heads => {
                if (heads) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Grubbin = Grubbin;
