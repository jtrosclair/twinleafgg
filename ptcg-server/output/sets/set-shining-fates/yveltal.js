"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Amazing Destruction',
                cost: [R, P, D, C, C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is Knocked Out.'
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal SHF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
