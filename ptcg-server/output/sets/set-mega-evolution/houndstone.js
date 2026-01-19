"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndstone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Houndstone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Greavard';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Horror Bite',
                cost: [P],
                damage: 30,
                text: 'Flip a coin until you get tails. For each heads, choose a random card from your opponent\'s hand. Your opponent reveals those cards and shuffles them into their deck.'
            },
            {
                name: 'Hammer In',
                cost: [P, P, C],
                damage: 130,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Houndstone';
        this.fullName = 'Houndstone M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let numCards = 0;
            const flipCoin = (heads = 0) => {
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        return flipCoin(heads + 1);
                    }
                    numCards = heads;
                    for (let i = 0; i < numCards; i++) {
                        if (opponent.hand.cards.length > 0) {
                            const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                            const randomCard = opponent.hand.cards[randomIndex];
                            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, [randomCard]);
                            (0, prefabs_1.MOVE_CARD_TO)(state, randomCard, opponent.deck);
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                        }
                    }
                    return state;
                });
            };
            return flipCoin();
        }
        return state;
    }
}
exports.Houndstone = Houndstone;
