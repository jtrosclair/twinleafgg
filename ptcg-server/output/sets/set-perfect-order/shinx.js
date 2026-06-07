"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shinx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Scratch',
                cost: [L],
                damage: 0,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.usSetNumber = 'POR 26';
        this.name = 'Shinx';
        this.fullName = 'Shinx M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let headsCount = 0;
            let flipsDone = 0;
            const flipCoins = (s) => {
                if (flipsDone >= 2) {
                    // All flips done, calculate damage
                    effect.damage = headsCount * 10;
                    return s;
                }
                const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                    flipsDone++;
                    if (result) {
                        headsCount++;
                    }
                    // Continue flipping until we've done 2 flips
                    if (flipsDone < 2) {
                        flipCoins(s);
                    }
                    else {
                        // All flips done, calculate damage
                        effect.damage = headsCount * 10;
                    }
                });
                return store.reduceEffect(s, coinFlipEffect);
            };
            return flipCoins(state);
        }
        return state;
    }
}
exports.Shinx = Shinx;
