"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treecko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
                name: 'Paralyzing Gaze',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'CG';
        this.name = 'Treecko';
        this.fullName = 'Treecko CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, player, this);
                }
            });
        }
        return state;
    }
}
exports.Treecko = Treecko;
