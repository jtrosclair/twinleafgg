"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jett = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jett extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEP';
        this.name = 'Jett';
        this.fullName = 'Jett MEP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.text = 'Draw a card for each of your opponent\'s Mega Evolution Pokemon ex in play.';
    }
    canPlay(store, state, player) {
        // Check if deck has cards
        if (player.deck.cards.length === 0) {
            return false;
        }
        // Check if supporter already played this turn
        if (player.supporterTurn > 0) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Count opponent's Mega Evolution Pokemon ex in play
            let megaEvolutionExCount = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, pokemonCard) => {
                if (pokemonCard instanceof game_1.PokemonCard &&
                    pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) &&
                    pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    megaEvolutionExCount++;
                }
            });
            (0, prefabs_1.DRAW_CARDS)(player, megaEvolutionExCount);
        }
        return state;
    }
}
exports.Jett = Jett;
