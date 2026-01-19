"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Abra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Abra';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.fullName = 'Abra BS';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.setNumber = '43';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Psyshock',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (heads) => {
                if (heads) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Abra = Abra;
