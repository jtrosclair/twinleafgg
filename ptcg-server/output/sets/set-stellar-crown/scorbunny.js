"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorbunny = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scorbunny extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Quick Attack',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.',
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Scorbunny';
        this.fullName = 'Scorbunny SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(effect.player, (result) => {
                if (result) {
                    effect.damage += 10;
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.Scorbunny = Scorbunny;
