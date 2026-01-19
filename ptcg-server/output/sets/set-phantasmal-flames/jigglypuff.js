"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jigglypuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Jigglypuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ball Roll',
                cost: [C],
                damage: 0,
                text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Jigglypuff';
        this.fullName = 'Jigglypuff M2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
                const player = effect.player;
                let headsCount = 0;
                const flipUntilTails = () => {
                    const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                        if (result) {
                            // Heads - increment count and flip again
                            headsCount++;
                            flipUntilTails();
                        }
                        else {
                            // Tails - calculate final damage
                            effect.damage = 20 * headsCount;
                        }
                    });
                    store.reduceEffect(state, coinFlipEffect);
                };
                flipUntilTails();
            }
            return state;
        }
        return state;
    }
}
exports.Jigglypuff = Jigglypuff;
