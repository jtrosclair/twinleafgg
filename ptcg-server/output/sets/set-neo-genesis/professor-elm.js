"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorElm = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ProfessorElm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.set = 'N1';
        this.name = 'Professor Elm';
        this.fullName = 'Professor Elm N1';
        this.text = 'Shuffle your hand into your deck. Then, draw 7 cards. You can\'t play any more Trainer cards this turn.';
        this.PROFESSOR_ELM_MARKER = 'PROFESSOR_ELM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (cards.length > 0) {
                player.hand.moveCardsTo(cards, player.deck);
                store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
            prefabs_1.ADD_MARKER(this.PROFESSOR_ELM_MARKER, player, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect
            || effect instanceof play_card_effects_1.PlaySupporterEffect
            || effect instanceof play_card_effects_1.AttachPokemonToolEffect
            || effect instanceof play_card_effects_1.PlayStadiumEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.PROFESSOR_ELM_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PROFESSOR_ELM_MARKER, this);
        return state;
    }
}
exports.ProfessorElm = ProfessorElm;
