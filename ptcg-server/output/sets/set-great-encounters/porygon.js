"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Calculate',
                cost: [C],
                damage: 0,
                text: 'Look at the top 3 cards of your deck and put them back on top of your deck in any order.'
            },
            {
                name: 'Sharpen',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Porygon';
        this.fullName = 'Porygon GE';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 3);
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
exports.Porygon = Porygon;
