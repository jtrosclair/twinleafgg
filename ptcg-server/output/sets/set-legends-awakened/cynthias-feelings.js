"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasFeelings = void 0;
const state_1 = require("../../game/store/state/state");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CynthiasFeelings extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Cynthia\'s Feelings';
        this.fullName = 'Cynthia\'s Feelings LA';
        this.text = 'Shuffle your hand into your deck. Then, draw 4 cards. If any of your Pokémon were Knocked Out during your opponent\'s last turn, draw 4 more cards.';
        this.FEELINGS_MARKER = 'FEELINGS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn.
            if (!duringTurn || state.players[state.activePlayer] !== opponent)
                return state;
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (owner === player)
                effect.player.marker.addMarker(this.FEELINGS_MARKER, this);
            return state;
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let cardsToDraw = 4;
            if (prefabs_1.HAS_MARKER(this.FEELINGS_MARKER, player, this))
                cardsToDraw = 8;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            prefabs_1.MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
            prefabs_1.SHUFFLE_DECK(store, state, player);
            prefabs_1.DRAW_CARDS(player, cardsToDraw);
            player.supporter.moveCardTo(this, player.discard);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.FEELINGS_MARKER, this);
        return state;
    }
}
exports.CynthiasFeelings = CynthiasFeelings;
