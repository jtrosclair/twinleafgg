"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremierBall = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class PremierBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Premier Ball';
        this.fullName = 'Premier Ball GE';
        this.text = 'Search your deck or your discard pile for a Pokémon LV.X, show it to your opponent, and put it into your hand. If you search your deck, shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const lvxInDiscard = player.discard.cards.some(c => c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_LV_X));
            if (player.deck.cards.length === 0 && lvxInDiscard === false) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [];
            if (player.deck.cards.length > 0) {
                options.push({
                    message: game_message_1.GameMessage.CHOOSE_CARD_FROM_DECK,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.LV_X }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                            cards.forEach(card => {
                                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                            });
                            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, cards);
                            player.deck.moveCardsTo(cards, player.hand);
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        });
                    }
                });
            }
            if (lvxInDiscard) {
                options.push({
                    message: game_message_1.GameMessage.CHOOSE_CARD_FROM_DISCARD,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.LV_X }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                            cards.forEach(card => {
                                store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                            });
                            player.discard.moveCardsTo(cards, player.hand);
                            return state;
                        });
                    }
                });
            }
            if (options.length === 1) {
                options[0].action();
            }
            else {
                return store.prompt(state, new game_1.SelectOptionPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, [
                    'Search your deck for a Pokémon LV.X',
                    'Search your discard pile for a Pokémon LV.X'
                ], {
                    allowCancel: true,
                }), choice => {
                    const option = options[choice];
                    option.action();
                });
            }
        }
        return state;
    }
}
exports.PremierBall = PremierBall;
