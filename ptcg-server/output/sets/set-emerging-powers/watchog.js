"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watchog = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const order_cards_prompt_1 = require("../../game/store/prompts/order-cards-prompt");
class Watchog extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Patrat';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Watcheck',
                cost: [C],
                damage: 0,
                text: 'Look at the top 5 cards of your opponent\'s deck and put them back on top of his or her deck in any order.'
            },
            {
                name: 'Quick Tail Smash',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Before doing damage, you may flip a coin. If heads, this attack does 60 more damage. If tails, this attack does nothing.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Watchog';
        this.fullName = 'Watchog EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 5);
            return store.prompt(state, new order_cards_prompt_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(opponent.deck);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // The player can choose to flip or not - simplified to always flip
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 60;
                }
                else {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Watchog = Watchog;
