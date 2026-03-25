"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Digger = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Digger extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Digger';
        this.fullName = 'Digger TR';
        this.text = 'Flip a coin. If tails, do 10 damage to your Active Pokémon. If heads, your opponent flips a coin. If tails, your opponent does 10 damage to his or her Active Pokémon. If heads, you flip a coin. Keep doing this until a player gets tails.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const flipCoin = (flipper) => {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, flipper, result => {
                    if (result) {
                        // Heads - other player flips
                        const otherPlayer = flipper === player ? opponent : player;
                        flipCoin(otherPlayer);
                    }
                    else {
                        // Tails - flipper takes damage
                        flipper.active.damage += 10;
                    }
                });
            };
            flipCoin(player);
        }
        return state;
    }
}
exports.Digger = Digger;
