"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rattata = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Rattata extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 30;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Paralyzing Gaze',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Rattata';
        this.fullName = 'Rattata BCR';
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
exports.Rattata = Rattata;
