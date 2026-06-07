"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcanion = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Volcanion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Volcanic Strength',
                cost: [W, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Powerful Steam',
                cost: [W, W, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'Flip a coin for each [W] Energy attached to this Pokemon. This attack does 90 damage for each heads.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.usSetNumber = 'POR 25';
        this.name = 'Volcanion';
        this.fullName = 'Volcanion M3';
    }
    reduceEffect(store, state, effect) {
        // Powerful Steam - flip coin for each Water Energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let headsCount = 0;
            let flipsDone = 0;
            // Count Water Energy attached to this Pokemon
            const waterEnergyCount = player.active.cards.filter(card => card.superType === game_1.SuperType.ENERGY && card.provides.includes(game_1.CardType.WATER)).length;
            if (waterEnergyCount === 0) {
                effect.damage = 0;
                return state;
            }
            const flipCoins = (s) => {
                if (flipsDone >= waterEnergyCount) {
                    // All flips done, calculate damage
                    effect.damage = headsCount * 90;
                    return s;
                }
                const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                    flipsDone++;
                    if (result === true) {
                        headsCount++;
                    }
                    // Continue flipping until we've done all flips
                    if (flipsDone < waterEnergyCount) {
                        flipCoins(s);
                    }
                    else {
                        // All flips done, calculate damage
                        effect.damage = headsCount * 90;
                    }
                });
                return store.reduceEffect(s, coinFlipEffect);
            };
            return flipCoins(state);
        }
        return state;
    }
}
exports.Volcanion = Volcanion;
