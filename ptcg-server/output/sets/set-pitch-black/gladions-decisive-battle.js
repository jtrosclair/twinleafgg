"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GladionsDecisiveBattle = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class GladionsDecisiveBattle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M5';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gladion\'s Decisive Battle';
        this.fullName = 'Gladion\'s Decisive Battle M5';
        this.text = `You may only play this card if it is the only card in your hand.\n\nDuring this turn, attacks used by your Pokémon that do not have a Rule Box deal 80 more damage to your opponent's Active Pokémon.`;
        this.GLADION_MARKER = 'M5_GLADIONS_DECISIVE_BATTLE';
    }
    reduceEffect(_store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const otherHand = player.hand.cards.filter(c => c !== effect.trainerCard);
            if (otherHand.length !== 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.marker.addMarker(this.GLADION_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect
            && effect.player.marker.hasMarker(this.GLADION_MARKER, this)
            && effect.target === effect.opponent.active
            && !effect.source.hasRuleBox()) {
            effect.damage += 80;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.GLADION_MARKER, this);
        }
        return state;
    }
}
exports.GladionsDecisiveBattle = GladionsDecisiveBattle;
