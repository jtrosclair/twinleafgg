"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Meowth';
        this.cardImage = 'assets/cardback.png';
        this.set = 'JU';
        this.setNumber = '56';
        this.fullName = 'Meowth JU';
        this.cardType = C;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Pay Day',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip a coin. If heads, draw a card.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
            ], (results) => {
                player.deck.moveTo(player.hand, 1);
            });
        }
        return state;
    }
}
exports.Meowth = Meowth;
