"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnglishMistyCC3 = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
// Printed English text: https://limitlesstcg.com/cards/30C/CC3 (Gym Heroes 18).
class EnglishMistyCC3 extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = '30C';
        this.setNumber = 'CC3';
        this.usSetNumber = '30C CC3';
        this.name = 'Misty';
        this.fullName = 'Misty 30C CC3';
        this.cardImage = 'assets/cardback.png';
        this.MISTY_MARKER = 'MISTY_30C_DAMAGE';
        this.text = "Discard 2 of the other cards in your hand in order to play this card. If this turn's attack does damage to the Defending Pokémon (after applying Weakness and Resistance), and if the attacking Pokémon has Misty in its name, the attack does 20 more damage to the Defending Pokémon.";
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const blocked = player.hand.cards.map((c, i) => c === this ? i : -1).filter(i => i >= 0);
            if (player.hand.cards.filter(c => c !== this).length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 2, max: 2, allowCancel: false, blocked }), selected => {
                if (!selected || selected.length !== 2) {
                    return;
                }
                player.hand.moveCardsTo(selected, player.discard);
                player.marker.addMarker(this.MISTY_MARKER, this);
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.damage > 0
            && effect.target === effect.opponent.active
            && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name.includes('Misty'))
            && effect.player.marker.hasMarker(this.MISTY_MARKER, this)) {
            // PutDamage is emitted after Weakness and Resistance, not before them.
            effect.damage += 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.MISTY_MARKER, this);
        }
        return state;
    }
}
exports.EnglishMistyCC3 = EnglishMistyCC3;
