"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class Repel extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SUM';
        this.name = 'Repel';
        this.fullName = 'Repel SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.text = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Legacy implementation:
            // - Prompted opponent to choose their Benched replacement Active.
            // - Switched opponent Active to that target.
            //
            // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
            (0, prefabs_1.SWITCH_OUT_OPPONENT_ACTIVE_POKEMON)(store, state, player, { allowCancel: false });
        }
        return state;
    }
}
exports.Repel = Repel;
