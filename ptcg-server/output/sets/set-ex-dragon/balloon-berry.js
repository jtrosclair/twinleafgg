"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalloonBerry = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class BalloonBerry extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DR';
        this.name = 'Balloon Berry';
        this.fullName = 'Balloon Berry DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.text = 'When the Pokémon Balloon Berry is attached to retreats, discard Balloon Berry instead of discarding Energy cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tools.includes(this) && state.phase !== state_1.GamePhase.ATTACK) {
            const player = effect.player;
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (index !== -1) {
                effect.cost.splice(index, 99);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.tools && cardList.tools.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        return state;
    }
}
exports.BalloonBerry = BalloonBerry;
