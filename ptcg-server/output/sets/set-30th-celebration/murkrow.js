"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Murkrow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Murkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Clumsily Clutch',
                cost: [card_types_1.CardType.DARK],
                damage: 20,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Murkrow';
        this.fullName = 'Murkrow 30C';
    }
    reduceEffect(store, state, effect) {
        // Clumsily Clutch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    return (0, prefabs_2.BLOCK_RETREAT)(store, state, effect, this);
                }
            });
        }
        return state;
    }
}
exports.Murkrow = Murkrow;
