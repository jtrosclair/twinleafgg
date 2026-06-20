"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togekiss = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Togekiss extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Togetic';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Wonder Kiss',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent\'s Active Pokémon gets Knocked Out, flip a coin. If heads, take 1 more Prize card for that Knock Out. This Ability does not stack.'
            }];
        this.attacks = [
            {
                name: 'Speed Wing',
                cost: [C, C, C],
                damage: 140,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Togekiss';
        this.fullName = 'Togekiss SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const knockedOutOwner = effect.player;
            const attacker = game_1.StateUtils.getOpponent(state, knockedOutOwner);
            // Check if this card is in play (active or bench)
            const isInPlay = attacker.active.cards.includes(this) || attacker.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, attacker, this)) {
                return state;
            }
            // Check if ability has already been activated for this knockout
            if (knockedOutOwner.marker.hasMarker('TOGEKISS_KNOCKOUT_FLIP')) {
                return state;
            }
            // Mark ability as used for this knockout
            knockedOutOwner.marker.addMarkerToState('TOGEKISS_KNOCKOUT_FLIP');
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(attacker.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    //If Heads, take 1 more Prize card for that Knock Out
                    if (effect.prizeCount > 0) {
                        effect.prizeCount += 1;
                    }
                }
                // Remove the marker after the coin flip
                knockedOutOwner.marker.removeMarker('TOGEKISS_KNOCKOUT_FLIP');
            });
        }
        return state;
    }
}
exports.Togekiss = Togekiss;
