"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothorita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothorita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gothita';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fortunate Eye',
                cost: [P],
                damage: 0,
                text: 'Look at the top 5 cards of your opponent\'s deck and put them back in any order.'
            },
            {
                name: 'Psyshot',
                cost: [P, C],
                damage: 40,
                text: ''
            }];
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Gothorita';
        this.fullName = 'Gothorita WHT';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const deckTop = new game_1.CardList();
            opponent.deck.moveTo(deckTop, 5);
            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(opponent.deck);
            });
        }
        return state;
    }
}
exports.Gothorita = Gothorita;
