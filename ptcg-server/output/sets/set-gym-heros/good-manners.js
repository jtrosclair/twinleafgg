"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoodManners = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GoodManners extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Good Manners';
        this.fullName = 'Good Manners G1';
        this.text = 'In order to play this card, you can\'t have any Basic Pokémon cards in your hand. Show your hand to your opponent, then search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.hand.cards.some(card => card instanceof game_1.PokemonCard && card.stage === card_types_1.Stage.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, player.hand.cards);
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1 });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.GoodManners = GoodManners;
