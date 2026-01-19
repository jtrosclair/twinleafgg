"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksJirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class PokeParksJirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Future Sight',
                cost: [C],
                damage: 0,
                text: 'Look at the top 5 cards of either player\'s deck and put them back on top of that player\'s deck in any order.'
            },
            {
                name: 'Swift',
                cost: [M, C],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Jirachi';
        this.fullName = 'PokéPark\'s Jirachi PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
    }
    reduceEffect(store, state, effect) {
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
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.PokeParksJirachi = PokeParksJirachi;
