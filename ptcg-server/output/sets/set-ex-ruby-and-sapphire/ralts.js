"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Confuse Ray',
                cost: [P],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Ralts';
        this.fullName = 'Ralts RS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Ralts = Ralts;
