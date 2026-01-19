"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Moonglow',
                powerType: game_1.PowerType.POKEBODY,
                text: 'The Retreat Cost for each Solrock you have in play is 0.'
            }];
        this.attacks = [
            {
                name: 'Foresight',
                cost: [C],
                damage: 0,
                text: 'Look at the top 5 cards of either player\'s deck and put them back on top of that player\'s deck in any order.'
            },
            {
                name: 'Target Beam',
                cost: [F, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each Solrock you have in play.'
            }
        ];
        this.set = 'DX';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone DX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isLunatoneInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isLunatoneInPlay = true;
                }
            });
            if (!isLunatoneInPlay) {
                return state;
            }
            if (!(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this) && active.name === 'Solrock') {
                effect.cost = [];
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.ORDER_YOUR_DECK,
                    action: () => {
                        if (player.deck.cards.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        const deckTop = new game_1.CardList();
                        player.deck.moveTo(deckTop, 5);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(player.deck);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.ORDER_OPPONENT_DECK,
                    action: () => {
                        if (opponent.deck.cards.length === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
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
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let solrockCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.name === 'Solrock') {
                    solrockCount++;
                }
            });
            // Modify damage based on count
            effect.damage += 10 * solrockCount;
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
