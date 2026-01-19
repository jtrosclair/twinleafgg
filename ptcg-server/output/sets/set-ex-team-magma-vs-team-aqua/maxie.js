"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maxie = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Maxie extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MA';
        this.name = 'Maxie';
        this.fullName = 'Maxie MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.text = 'Search your hand or discard pile for a Pokémon with Team Magma in its name and put it onto your Bench. Treat the new Benched Pokémon as a Basic Pokémon. If it is a Stage 2 Pokémon, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
            (0, prefabs_1.BLOCK_IF_NO_SLOTS)(slots);
            const blockedHand = [];
            let hasTeamMagmaInHand = false;
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    hasTeamMagmaInHand = true;
                }
                else {
                    blockedHand.push(index);
                }
            });
            const blockedDiscard = [];
            let hasTeamMagmaInDiscard = false;
            player.discard.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                    hasTeamMagmaInDiscard = true;
                }
                else {
                    blockedDiscard.push(index);
                }
            });
            // Error if no targets
            if (!hasTeamMagmaInHand && !hasTeamMagmaInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const options = [];
            // Add possible options
            if (hasTeamMagmaInHand) {
                options.push({
                    message: game_message_1.GameMessage.CHOOSE_CARD_TO_HAND,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedHand }), selected => {
                            const cards = selected || [];
                            cards.forEach((card, index) => {
                                var _a;
                                player.hand.moveCardTo(card, slots[index]);
                                slots[index].pokemonPlayedTurn = state.turn;
                                if (((_a = slots[index].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                                    slots[index].damage += 20; // Add 2 damage counters
                                }
                            });
                        });
                    }
                });
            }
            // If there are cards in discard, add option to choose from there
            if (hasTeamMagmaInDiscard) {
                options.push({
                    message: game_message_1.GameMessage.CHOOSE_CARD_FROM_DISCARD,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedDiscard }), selected => {
                            const cards = selected || [];
                            cards.forEach((card, index) => {
                                var _a;
                                player.discard.moveCardTo(card, slots[index]);
                                slots[index].pokemonPlayedTurn = state.turn;
                                if (((_a = slots[index].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                                    slots[index].damage += 20; // Add 2 damage counters
                                }
                            });
                        });
                    }
                });
            }
            // If only one option, execute it immediately
            if (options.length === 1) {
                options[0].action();
            }
            else { // If multiple options, prompt the player to choose
                store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, [
                    'Choose a Team Magma Pokémon from your hand to put onto your Bench',
                    'Choose a Team Magma Pokémon from your discard pile to put onto your Bench'
                ], {
                    allowCancel: true,
                }), choice => {
                    const option = options[choice];
                    option.action();
                });
            }
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.Maxie = Maxie;
