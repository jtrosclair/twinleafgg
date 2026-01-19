"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TateAndLiza = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TateAndLiza extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Tate & Liza';
        this.fullName = 'Tate & Liza CES';
        this.text = 'Choose 1:' +
            '• Shuffle your hand into your deck. Then, draw 5 cards.' +
            '• Switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_message_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            player.switchPokemon(cardList);
                            (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.SHUFFLE_YOUR_HAND,
                    action: () => {
                        if (player.hand.cards.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this), sourceCard: this });
                        }
                        store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                        (0, prefabs_1.DRAW_CARDS)(player, 5);
                        (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
                    }
                }
            ];
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                options.splice(0, 1);
            }
            if (player.deck.cards.length === 0) {
                options.splice(1, 1);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.TateAndLiza = TateAndLiza;
