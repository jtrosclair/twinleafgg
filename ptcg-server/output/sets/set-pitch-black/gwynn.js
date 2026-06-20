"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gwynn = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function pokemonCardHasRuleBox(card) {
    return (card.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_EX) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_V) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_VUNION) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
        card.tags.includes(card_types_1.CardTag.TAG_TEAM) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_LV_X) ||
        card.tags.includes(card_types_1.CardTag.BREAK) ||
        card.tags.includes(card_types_1.CardTag.PRISM_STAR) ||
        card.tags.includes(card_types_1.CardTag.MEGA) ||
        card.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) ||
        card.tags.includes(card_types_1.CardTag.LEGEND) ||
        card.tags.includes(card_types_1.CardTag.RADIANT));
}
function* playGwynn(next, store, state, effect, self) {
    const player = effect.player;
    const blocked = [];
    player.hand.cards.forEach((c, i) => {
        if (!(c instanceof game_1.PokemonCard) || pokemonCardHasRuleBox(c)) {
            blocked.push(i);
        }
    });
    const selectableCount = player.hand.cards.length - blocked.length;
    if (selectableCount < 2) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 2, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: self });
    (0, prefabs_1.DRAW_CARDS)(player, cards.length * 3);
    (0, prefabs_1.CLEAN_UP_SUPPORTER)(store, effect, player);
}
class Gwynn extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M5';
        this.setNumber = '78';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gwynn';
        this.fullName = 'Gwynn M5';
        this.text = 'Discard 2 Pokémon from your hand (excluding any Rule Box Pokémon). Draw 3 cards for each Pokémon discarded in this way.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const generator = playGwynn(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.Gwynn = Gwynn;
