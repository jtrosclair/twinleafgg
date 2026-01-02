"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatrolCap = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class PatrolCap extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'OBF';
        this.name = 'Patrol Cap';
        this.fullName = 'Patrol Cap OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.text = 'As long as the Pokémon this card is attached to is in the Active Spot, cards in your deck can\'t be discarded by effects of your opponent\'s attacks, Abilities, Item cards, Pokémon Tool cards, or Supporter cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.MoveCardsEffect) {
            state.players.forEach((player) => {
                if (player.active.tools.includes(this) && effect.source === player.deck && effect.destination === player.discard) {
                    // if the card is not from the player, prevent the discard
                    if (effect.sourceCard && game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, effect.sourceCard)) !== player) {
                        effect.preventDefault = true;
                    }
                }
            });
        }
        return state;
    }
}
exports.PatrolCap = PatrolCap;
