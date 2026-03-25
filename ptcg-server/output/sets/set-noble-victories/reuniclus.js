"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const order_cards_prompt_1 = require("../../game/store/prompts/order-cards-prompt");
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Future Sight',
                cost: [P],
                damage: 0,
                text: 'Look at the top 5 cards of your deck and put them back on top of your deck in any order.'
            },
            {
                name: 'Net Force',
                cost: [P],
                damage: 40,
                damageCalculation: 'x',
                text: 'Does 40 damage times the number of Reuniclus you have in play.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus NVI 52';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            const cardsToLook = Math.min(5, player.deck.cards.length);
            player.deck.moveTo(deckTop, cardsToLook);
            return store.prompt(state, new order_cards_prompt_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let reuniclusCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard && pokemonCard.name === 'Reuniclus') {
                    reuniclusCount++;
                }
            });
            effect.damage = 40 * reuniclusCount;
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
