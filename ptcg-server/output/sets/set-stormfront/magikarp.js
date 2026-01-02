"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magikarp = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magikarp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sea Spray',
                cost: [],
                damage: 0,
                text: 'Flip a coin until you get tails. For each heads, draw a card.'
            },
            {
                name: 'Splash',
                cost: [W],
                damage: 10,
                text: ''
            }];
        this.set = 'SF';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magikarp';
        this.fullName = 'Magikarp SF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    prefabs_1.DRAW_CARDS(player, heads);
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Magikarp = Magikarp;
