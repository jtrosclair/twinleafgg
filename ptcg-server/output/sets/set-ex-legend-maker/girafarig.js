"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Girafarig = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Girafarig extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.retreat = [C];
        this.weakness = [{ type: P }];
        this.powers = [{
                name: 'Rear Sensor',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'Each player\'s Active Basic Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
            }];
        this.attacks = [
            {
                name: 'Foresight',
                cost: [C],
                damage: 0,
                text: 'Look at the top 5 cards on either player\'s deck and put them back on top of that player\'s deck in any order you like.'
            },
            {
                name: 'Disorder',
                cost: [P, C],
                damage: 20,
                text: 'If the Defending Pokémon has any Special Energy cards attached to it, the Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'LM';
        this.name = 'Girafarig';
        this.fullName = 'Girafarig LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
    }
    reduceEffect(store, state, effect) {
        // Block Poké-Powers from basics when active
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER) {
            const player = effect.player;
            const thisCardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, thisCardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGirafarigInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isGirafarigInPlay = true;
                }
            });
            if (!isGirafarigInPlay) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            // Only check opponent's Active Pokemon
            if (player.active.getPokemonCard() !== effect.card) {
                return state;
            }
            let effectCardList;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === effect.card) {
                    effectCardList = cardList;
                }
            });
            if ((effectCardList === null || effectCardList === void 0 ? void 0 : effectCardList.getPokemons().length) === 1 || effect.card.tags.includes(card_types_1.CardTag.LEGEND) && !effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Drag Off
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
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            const opponent = effect.opponent;
            const pokemon = opponent.active;
            let specialEnergyCount = 0;
            pokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyCount++;
                    }
                }
            });
            if (specialEnergyCount > 0) {
                (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            }
        }
        return state;
    }
}
exports.Girafarig = Girafarig;
