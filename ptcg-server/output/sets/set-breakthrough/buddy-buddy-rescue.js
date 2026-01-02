"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyBuddyRescue = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BuddyBuddyRescue extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Buddy-Buddy Rescue';
        this.fullName = 'Buddy-Buddy Rescue SSH';
        this.text = 'Each player puts a Pokémon from his or her discard pile into his or her hand. (Your opponent chooses first.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count Pokemon in discard piles and build blocked lists
            let pokemonInPlayersDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard) {
                    pokemonInPlayersDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            let pokemonInOpponentsDiscard = 0;
            const blockedOpponent = [];
            opponent.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard) {
                    pokemonInOpponentsDiscard += 1;
                }
                else {
                    blockedOpponent.push(index);
                }
            });
            // Check if card can be played
            if (pokemonInOpponentsDiscard === 0 && pokemonInPlayersDiscard === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if effect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.supporter, { superType: card_types_1.SuperType.TRAINER }, { min: 1, max: 1, allowCancel: false }), selected => {
                    if (selected && selected.length > 0) {
                        player.supporter.moveCardsTo(selected, player.discard);
                    }
                });
                return state;
            }
            // Handle opponent's selection first
            if (pokemonInOpponentsDiscard > 0) {
                store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedOpponent }), selected => {
                    if (selected && selected.length > 0) {
                        const card = selected[0];
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, {
                            name: opponent.name,
                            card: card.name
                        });
                        store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
                            if (selected && selected.length > 0) {
                                prefabs_1.MOVE_CARDS(store, state, opponent.discard, opponent.hand, { cards: selected, sourceCard: this });
                            }
                        });
                    }
                });
            }
            // Handle player's selection
            if (pokemonInPlayersDiscard > 0) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                    if (selected && selected.length > 0) {
                        const card = selected[0];
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, {
                            name: player.name,
                            card: card.name
                        });
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
                            if (selected && selected.length > 0) {
                                prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: selected, sourceCard: this });
                            }
                        });
                    }
                });
            }
            // Move the trainer card to discard after both selections
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.supporter, { superType: card_types_1.SuperType.TRAINER }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    player.supporter.moveCardsTo(selected, player.discard);
                }
            });
            return state;
        }
        return state;
    }
}
exports.BuddyBuddyRescue = BuddyBuddyRescue;
