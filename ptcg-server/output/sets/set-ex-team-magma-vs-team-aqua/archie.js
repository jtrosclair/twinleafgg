"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archie = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Archie extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MA';
        this.name = 'Archie';
        this.fullName = 'Archie MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.text = 'Search your deck for a Pokémon with Team Aqua in its name and put it onto your Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as a Basic Pokémon. If it is a Stage 2 Pokémon, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
            (0, prefabs_1.BLOCK_IF_NO_SLOTS)(slots);
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    var _a;
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                    if (((_a = slots[index].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                        slots[index].damage += 20; // Add 2 damage counters
                    }
                });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.Archie = Archie;
