"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Wave Swallower',
                cost: [W, W, W],
                damage: 50,
                text: 'Flip a coin until you get tails. For each heads, heal 50 damage from this Pokémon.'
            }
        ];
        this.set = 'CES';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer CES';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const flipCoin = (healAmount = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(healAmount + 50);
                    }
                    if (healAmount > 0) {
                        const healEffect = new game_effects_1.HealEffect(player, player.active, healAmount);
                        store.reduceEffect(state, healEffect);
                    }
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Wailmer = Wailmer;
