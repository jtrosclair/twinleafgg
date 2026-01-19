"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treecko2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Treecko2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pound',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Shining Claws',
                cost: [P],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'CG';
        this.setNumber = '68';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Treecko';
        this.fullName = 'Treecko CG 68';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Treecko2 = Treecko2;
