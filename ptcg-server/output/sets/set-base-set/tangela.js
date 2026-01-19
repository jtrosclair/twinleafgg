"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tangela = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tangela extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Tangela';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.set = 'BS';
        this.fullName = 'Tangela';
        this.cardType = card_types_1.CardType.GRASS;
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesInto = 'Tangrowth';
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bind',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Poisonpowder',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Tangela = Tangela;
