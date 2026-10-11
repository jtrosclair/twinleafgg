"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu34 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** #34 — Pika Chain */
class Pikachu34 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Pika Chain',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each of your Pikachu and Pikachu ex in play.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 34';
    }
    reduceEffect(store, state, effect) {
        // Pika Chain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let count = 0;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard() !== card) {
                    return;
                }
                if (card.name === 'Pikachu' || card.name === 'Pikachu ex') {
                    count++;
                }
            });
            effect.damage = 40 * count;
        }
        return state;
    }
}
exports.Pikachu34 = Pikachu34;
