"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.resistance = [{ type: F, value: -30 }];
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Future Sight',
                cost: [C],
                damage: 0,
                text: 'Look at the top 4 cards of either player\'s deck and put them back in any order.'
            }
        ];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Duskull';
        this.fullName = 'Duskull VIV';
    }
    reduceEffect(store, state, effect) {
        // Future Sight
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.ORDER_OPPONENT_DECK,
                    action: () => {
                        const opponentDeckTop = new game_1.CardList();
                        opponent.deck.moveTo(opponentDeckTop, 4);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, opponentDeckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            opponentDeckTop.applyOrder(order);
                            opponentDeckTop.moveToTopOfDestination(opponent.deck);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.ORDER_YOUR_DECK,
                    action: () => {
                        const player = effect.player;
                        const playerDeckTop = new game_1.CardList();
                        player.deck.moveTo(playerDeckTop, 4);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, playerDeckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            playerDeckTop.applyOrder(order);
                            playerDeckTop.moveToTopOfDestination(player.deck);
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Duskull = Duskull;
