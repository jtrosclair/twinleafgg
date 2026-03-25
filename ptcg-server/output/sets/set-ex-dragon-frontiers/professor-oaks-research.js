"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorOaksResearch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ProfessorOaksResearch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DF';
        this.name = 'Professor Oak\'s Research';
        this.fullName = 'Professor Oak\'s Research DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.text = 'Shuffle your hand into your deck, then draw 5 cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.DRAW_CARDS)(player, 5);
        }
        return state;
    }
}
exports.ProfessorOaksResearch = ProfessorOaksResearch;
