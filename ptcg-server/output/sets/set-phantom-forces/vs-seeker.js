"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VsSeeker = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class VsSeeker extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PHF';
        this.name = 'VS Seeker';
        this.fullName = 'VS Seeker PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.text = 'Put a Supporter card from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const hasSupporter = player.discard.cards.some(c => {
                return c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (!hasSupporter) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (!(card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false, blocked });
            return state;
        }
        return state;
    }
}
exports.VsSeeker = VsSeeker;
