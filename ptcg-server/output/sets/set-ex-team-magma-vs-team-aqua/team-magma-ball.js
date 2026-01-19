"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmaBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class TeamMagmaBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'MA';
        this.name = 'Team Magma Ball';
        this.fullName = 'Team Magma Ball MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.text = 'Flip a coin. If heads, search your deck for a Pokémon that has Team Magma in its name, show it to your opponent, and put it into your hand. If tails, search your deck for a Basic Pokémon that has Team Magma in its name, show it to your opponent and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Not the most efficient way to handle this, but it was being weird when I tried another way
            const blocked = [];
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.deck.cards.forEach((card, index) => {
                        if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                            return;
                        }
                        else {
                            blocked.push(index);
                        }
                    });
                }
                else {
                    player.deck.cards.forEach((card, index) => {
                        if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_MAGMA) && card.stage === card_types_1.Stage.BASIC) {
                            return;
                        }
                        else {
                            blocked.push(index);
                        }
                    });
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1, allowCancel: false, blocked });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.TeamMagmaBall = TeamMagmaBall;
