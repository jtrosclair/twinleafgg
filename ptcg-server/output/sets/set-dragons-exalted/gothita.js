"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Future Sight',
                cost: [P],
                damage: 0,
                text: 'Look at the top 5 cards of your deck and put them back on top of your deck in any order.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gothita';
        this.fullName = 'Gothita DRX';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Future Sight - look at top 5, reorder
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const count = Math.min(5, player.deck.cards.length);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, count);
            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        return state;
    }
}
exports.Gothita = Gothita;
