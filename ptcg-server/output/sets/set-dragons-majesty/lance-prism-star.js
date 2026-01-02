"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LancePrismStar = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const state_1 = require("../../game/store/state/state");
class LancePrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'DRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Lance Prism Star';
        this.fullName = 'Lance Prism Star DRM';
        this.text = 'You can play this card only if 1 of your Pokémon was Knocked Out during your opponent\'s last turn.\n\nSearch your deck for up to 2 [N] Pokémon and put them onto your Bench.Then, shuffle your deck.';
        this.LANCE_MARKER = 'LANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // No Pokemon KO last turn
            if (!player.marker.hasMarker(this.LANCE_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { cardType: card_types_1.CardType.DRAGON }, { min: 0, max: 2, allowCancel: false });
            player.supporter.moveCardTo(this, player.lostzone);
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const duringTurn = [state_1.GamePhase.PLAYER_TURN, state_1.GamePhase.ATTACK].includes(state.phase);
            // Do not activate between turns, or when it's not opponents turn.
            if (!duringTurn || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                prefabs_1.ADD_MARKER(this.LANCE_MARKER, player, this);
            }
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.LANCE_MARKER, this);
        return state;
    }
}
exports.LancePrismStar = LancePrismStar;
