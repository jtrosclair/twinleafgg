"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treecko = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Treecko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tail Shake',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Slash',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'PCGP';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Treecko';
        this.fullName = 'Treecko PCGP 37';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Treecko = Treecko;
