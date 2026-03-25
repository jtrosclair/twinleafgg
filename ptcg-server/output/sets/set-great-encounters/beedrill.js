"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beedrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R, value: +30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Band Attack',
                cost: [G],
                damage: 30,
                damageCalculation: 'x',
                text: 'Does 30 damage times the number of Beedrill you have in play.'
            },
            {
                name: 'Twineedle',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            }];
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill GE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let damage = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Beedrill') {
                    damage += 30;
                }
            });
            effect.damage = damage;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.Beedrill = Beedrill;
