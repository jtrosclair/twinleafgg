"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApricornForest = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ApricornForest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'AQ';
        this.name = 'Apricorn Forest';
        this.fullName = 'Apricorn Forest AQ';
        this.text = 'Once during each player\'s turn (before attacking), if that player\'s Bench isn\'t full, that player flips a coin. If heads, that player shows his or her opponent a basic Energy card from his or her hand. Then, that player searches his or her deck for a Basic Pokémon card of the same type (color) as the revealed Energy card and puts it onto his or her Bench. The player shuffles his or her deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (player.hand.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC).length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (slots.length == 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            else {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARDS, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selectedCards => {
                            const energyCard = selectedCards[0];
                            const energyColor = energyCard.provides[0];
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: [energyCard] });
                            const blocked = [];
                            player.deck.cards.forEach((card, index) => {
                                if (!(card instanceof game_1.PokemonCard)) {
                                    blocked.push(index);
                                }
                                if (card instanceof game_1.PokemonCard && card.cardType !== energyColor) {
                                    blocked.push(index);
                                }
                            });
                            let cards = [];
                            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                                cards = selectedCards || [];
                                // Operation canceled by the user
                                if (cards.length === 0) {
                                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                        player.deck.applyOrder(order);
                                    });
                                }
                                else {
                                    cards.forEach((card, index) => {
                                        player.deck.moveCardTo(card, slots[index]);
                                        slots[index].pokemonPlayedTurn = state.turn;
                                    });
                                }
                                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                    player.deck.applyOrder(order);
                                });
                            });
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.ApricornForest = ApricornForest;
