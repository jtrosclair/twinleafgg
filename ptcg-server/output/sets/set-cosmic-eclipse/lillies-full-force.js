"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesFullForce = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LilliesFullForce extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '196';
        this.name = 'Lillie\'s Full Force';
        this.fullName = 'Lillie\'s Full Force CEC';
        this.LILLIES_FORCE_MARKER = 'LILLIES_FORCE_MARKER';
        this.text = `Draw 4 cards.

At the end of this turn, if you have 3 or more cards in your hand, shuffle cards from your hand into your deck until you have 2 cards in your hand. `;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 4);
            (0, prefabs_1.ADD_MARKER)(this.LILLIES_FORCE_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.LILLIES_FORCE_MARKER, effect.player, this)) {
            if (effect.player.hand.cards.length >= 3) {
                const discardAmount = effect.player.hand.cards.length - 3;
                return store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, effect.player.hand, {}, { min: discardAmount, max: discardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    (0, prefabs_1.MOVE_CARDS)(store, state, effect.player.hand, effect.player.deck, { cards, sourceCard: this });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, effect.player);
                });
            }
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.LILLIES_FORCE_MARKER, this);
        return state;
    }
}
exports.LilliesFullForce = LilliesFullForce;
