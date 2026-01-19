"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoothoot = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoothoot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hypnosis',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Peck',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Hoothoot';
        this.fullName = 'Hoothoot N1';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Hoothoot = Hoothoot;
