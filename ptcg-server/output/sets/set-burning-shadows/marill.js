"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.attacks = [{
                name: 'Bubble',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Rollout',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'BUS';
        this.setNumber = '34';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marill';
        this.fullName = 'Marill BUS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result === true) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, player), this);
                }
            });
        }
        return state;
    }
}
exports.Marill = Marill;
