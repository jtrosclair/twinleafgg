"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gyarados = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gyarados extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Gyarados BS';
        this.name = 'Gyarados';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magikarp';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dragon Rage',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 50,
                text: ''
            },
            {
                name: 'Bubble Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 40,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Gyarados = Gyarados;
