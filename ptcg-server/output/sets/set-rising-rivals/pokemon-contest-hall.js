"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonContestHall = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class PokemonContestHall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'RR';
        this.name = 'Pokémon Contest Hall';
        this.fullName = 'Pokémon Contest Hall RR';
        this.text = 'Once during each player\'s turn, if that player\'s Bench isn\'t full, the player may flip a coin. If heads, that player searches his or her deck for a Basic Pokémon and puts it onto his or her Bench. If the player does, he or she may search his or her deck for a Pokémon Tool card and attach it to that Pokémon. If that player searched his or her deck, the player shuffles his or her deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            if (slots.length == 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, (result) => {
                if (result) {
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                        cards = selectedCards || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            prefabs_1.SHUFFLE_DECK(store, state, player);
                        }
                        else {
                            cards.forEach((card, index) => {
                                prefabs_1.MOVE_CARD_TO(state, card, slots[index]);
                                slots[index].pokemonPlayedTurn = state.turn;
                                prefabs_1.CONFIRMATION_PROMPT(store, state, player, (result) => {
                                    if (result) {
                                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                                            if (selectedCards.length > 0) {
                                                selectedCards.forEach(card => {
                                                    prefabs_1.MOVE_CARD_TO(state, card, slots[index]);
                                                    slots[index].tools.push(card);
                                                });
                                            }
                                            prefabs_1.SHUFFLE_DECK(store, state, player);
                                        });
                                    }
                                });
                            });
                        }
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    });
                }
            });
        }
        return state;
    }
}
exports.PokemonContestHall = PokemonContestHall;
