"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonTransceiver = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class HolonTransceiver extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Holon Transceiver';
        this.fullName = 'Holon Transceiver DS';
        this.text = 'Search your deck for a Supporter card that has Holon in its name, show it to your opponent, and put it into your hand. Shuffle your deck afterward. Or, search your discard pile for a Supporter card that has Holon in its name, show it to your opponent, and put it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const holonInDiscard = player.discard.cards.some(c => c instanceof trainer_card_1.TrainerCard
                && c.trainerType === card_types_1.TrainerType.SUPPORTER
                && c.name.includes('Holon'));
            if (player.deck.cards.length === 0 && holonInDiscard === false) {
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
                        const blocked = player.deck.cards
                            .filter(c => !c.name.includes('Holon'))
                            .map(c => player.deck.cards.indexOf(c));
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: cards, sourceCard: this });
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        });
                    }
                });
            }
            if (holonInDiscard) {
                options.push({
                    message: game_message_1.GameMessage.CHOOSE_CARD_FROM_DISCARD,
                    action: () => {
                        let cards = [];
                        const blocked = player.discard.cards
                            .filter(c => !c.name.includes('Holon'))
                            .map(c => player.discard.cards.indexOf(c));
                        store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                            cards = selected || [];
                            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: cards, sourceCard: this });
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
                    'Search your deck for a Supporter card that has Holon in its name',
                    'Search your discard pile for a Supporter card that has Holon in its name'
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
exports.HolonTransceiver = HolonTransceiver;
