"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = C;
        this.hp = 70;
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Spiral Wave',
                cost: [L, W],
                damage: 20,
                damageCalculationn: 'x',
                text: 'Flip a coin until you get tails. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'EX';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair EX';
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
                    effect.damage = 20 * heads;
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
