"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueCarrier = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect, self) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const blocked = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && card.hp > 90) {
            blocked.push(index);
        }
    });
    if (blocked.length === player.discard.cards.length) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 2, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: cards, sourceCard: self });
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
}
class RescueCarrier extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Rescue Carrier';
        this.fullName = 'Rescue Carrier EVS';
        this.text = 'Put up to 2 Pokémon, each with 90 HP or less, from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.RescueCarrier = RescueCarrier;
