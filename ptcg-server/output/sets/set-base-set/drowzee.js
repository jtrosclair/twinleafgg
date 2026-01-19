"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drowzee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drowzee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Drowzee';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.fullName = 'Drowzee BS';
        this.setNumber = '49';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Drowzee = Drowzee;
