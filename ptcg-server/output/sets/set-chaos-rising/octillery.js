"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octillery = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Octillery extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Remoraid';
        this.hp = 110;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Corner Stop',
                cost: [W],
                damage: 30,
                text: 'During your opponent\'s next turn, when the Defending Pokemon tries to attack, your opponent flips 2 coins. If either is tails, that attack does nothing.'
            },
            {
                name: 'Tantrum',
                cost: [W, C],
                damage: 120,
                text: 'This Pokemon is now Confused.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.usSetNumber = 'POR 17';
        this.name = 'Octillery';
        this.fullName = 'Octillery M4';
        this.CORNER_STOP_MARKER = 'OCTILLERY_M4_CORNER_STOP_MARKER';
        this.CLEAR_MARKER = 'OCTILLERY_M4_CLEAR_MARKER';
        this.USED_MARKER = 'OCTILLERY_M4_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.ADD_MARKER)(this.CORNER_STOP_MARKER, opponent.active, this);
            (0, prefabs_1.ADD_MARKER)(this.CLEAR_MARKER, opponent, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect
            && (0, prefabs_1.HAS_MARKER)(this.CORNER_STOP_MARKER, effect.player.active, this)) {
            const attackingPlayer = effect.player;
            const defender = game_1.StateUtils.getOpponent(state, attackingPlayer);
            if ((0, prefabs_1.HAS_MARKER)(this.USED_MARKER, defender, this)) {
                return state;
            }
            effect.preventDefault = true;
            defender.marker.addMarker(this.USED_MARKER, this);
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, attackingPlayer, 2, results => {
                if (results.every(r => r)) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(attackingPlayer, effect.attack);
                    store.reduceEffect(state, useAttackEffect);
                }
                else {
                    store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(attackingPlayer));
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.CLEAR_MARKER, effect.player, this)) {
            effect.player.marker.removeMarker(this.CLEAR_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.CORNER_STOP_MARKER, this);
            });
        }
        if ((0, prefabs_2.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_2.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
        }
        return state;
    }
}
exports.Octillery = Octillery;
