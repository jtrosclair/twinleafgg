"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorbunny2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Scorbunny2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flaring Dash',
                cost: [R],
                damage: 0,
                text: 'Flip a coin until you get tails. For each heads, draw a card.'
            },
            {
                name: 'Flare',
                cost: [R, C, C],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'E';
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '244';
        this.name = 'Scorbunny';
        this.fullName = 'Scorbunny SWSH 244';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    (0, prefabs_1.DRAW_CARDS)(player, heads);
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Scorbunny2 = Scorbunny2;
