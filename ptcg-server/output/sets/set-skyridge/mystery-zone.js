"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryZone = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class MysteryZone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'SK';
        this.name = 'Mystery Zone';
        this.fullName = 'Mystery Zone SK';
        this.text = 'Once during each player\'s turn (before he or she attacks), if that player has an Evolution card in his or her hand, he or she may search his or her deck for a basic Energy card, show it to his or her opponent, and put it into his or her hand. Then that player chooses an Evolution card from his or her hand, shows it to his or her opponent, and puts it into his or her deck. That player shuffles his or her deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (!player.hand.cards.some(c => c instanceof game_1.PokemonCard && c.evolvesFrom !== '')) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
                if (cards.length > 0) {
                    state = store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
                const blocked = [];
                player.hand.cards.forEach((card, index) => {
                    if (card instanceof game_1.PokemonCard && card.evolvesFrom === '') {
                        blocked.push(index);
                    }
                });
                state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked }), selectedToDeck => {
                    const evolutionCards = selectedToDeck || [];
                    if (evolutionCards.length > 0) {
                        state = store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, evolutionCards), () => { });
                        player.hand.moveCardsTo(evolutionCards, player.deck);
                    }
                    state = store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        return state;
    }
}
exports.MysteryZone = MysteryZone;
