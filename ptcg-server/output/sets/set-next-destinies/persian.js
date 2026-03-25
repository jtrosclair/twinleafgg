"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Persian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meowth';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Nasty Plot',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a card and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Shadow Claw',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, discard a random card from your opponent\'s hand.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Persian';
        this.fullName = 'Persian NXD';
    }
    reduceEffect(store, state, effect) {
        // Nasty Plot - search deck for any card
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: true }), (selected) => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    cards.forEach(card => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Shadow Claw - flip coin for random discard
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.hand.cards.length > 0) {
                    // Discard random card from opponent's hand
                    const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                    const cardToDiscard = opponent.hand.cards[randomIndex];
                    opponent.hand.moveCardsTo([cardToDiscard], opponent.discard);
                    store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: cardToDiscard.name });
                }
            });
        }
        return state;
    }
}
exports.Persian = Persian;
