"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gastly = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gastly extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Surprise Attack',
                cost: [D],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Gastly';
        this.fullName = 'Gastly M3';
    }
    reduceEffect(store, state, effect) {
        // Surprise Attack - coin flip
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this) && effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                if (result === false) {
                    // Tails - attack does nothing
                    effect.damage = 0;
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.Gastly = Gastly;
