"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorElmsTrainingMethod = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ProfessorElmsTrainingMethod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Professor Elm\'s Training Method';
        this.fullName = 'Professor Elm\'s Training Method UF';
        this.text = 'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                // eslint-disable-next-line no-empty
                if (card instanceof game_1.PokemonCard && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X) {
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1, blocked });
            return state;
        }
        return state;
    }
}
exports.ProfessorElmsTrainingMethod = ProfessorElmsTrainingMethod;
