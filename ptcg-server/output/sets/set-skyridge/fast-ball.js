"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const cards = [];
    let evolution;
    for (let i = 0; i < player.deck.cards.length; i++) {
        const card = player.deck.cards[i];
        cards.push(card);
        if (card instanceof game_1.PokemonCard
            && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X) {
            evolution = card;
            break;
        }
    }
    yield store.prompt(state, [
        new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
        new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)
    ], () => next());
    if (evolution !== undefined) {
        player.deck.moveCardTo(evolution, player.hand);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    prefabs_1.SHUFFLE_DECK(store, state, player);
}
class FastBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SK';
        this.name = 'Fast Ball';
        this.fullName = 'Fast Ball SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.text = 'Reveal cards from your deck until you reveal an Evolution card. Show that card to your opponent and put it into your hand. Shuffle the other revealed cards into your deck. (If you don\'t reveal an Evolution card, shuffle all the revealed cards back into your deck.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FastBall = FastBall;
