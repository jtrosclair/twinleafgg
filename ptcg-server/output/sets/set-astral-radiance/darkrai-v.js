"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkraiV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkraiV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Wind of Darkness',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Dark Void',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Darkrai V';
        this.fullName = 'Darkrai V ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.DarkraiV = DarkraiV;
