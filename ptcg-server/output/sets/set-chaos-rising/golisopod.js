"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golisopod = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_1 = require("../../game/store/state/state");
class Golisopod extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wimpod';
        this.hp = 140;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Critical Cut',
                cost: [W],
                damage: 30,
                text: 'If this attack\'s damage Knocks Out your opponent\'s Active Pokemon, during your opponent\'s next turn, this Pokemon can\'t be affected by damage or effects of attacks.'
            },
            {
                name: 'Boundless Power',
                cost: [C, C, C],
                damage: 150,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Golisopod';
        this.fullName = 'Golisopod M4';
        this.INVULN_MARKER = 'GOLISOPOD_M4_INVULN_MARKER';
        this.CLEAR_MARKER = 'GOLISOPOD_M4_CLEAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHp = (_b = (_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.hp) !== null && _b !== void 0 ? _b : 0;
            const opponentDamage = opponent.active.damage;
            if (opponentDamage + effect.damage >= opponentHp) {
                player.active.marker.addMarker(this.INVULN_MARKER, this);
                opponent.marker.addMarker(this.CLEAR_MARKER, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotAttackNextTurnPending = true;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            if (owner.active.marker.hasMarker(this.INVULN_MARKER, this) && state.phase === state_1.GamePhase.ATTACK) {
                effect.damage = 0;
                effect.preventDefault = true;
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            if (owner.active.marker.hasMarker(this.INVULN_MARKER, this) && state.phase === state_1.GamePhase.ATTACK) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_MARKER, this);
            const golisopodOwner = game_1.StateUtils.getOpponent(state, effect.player);
            golisopodOwner.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                cardList.marker.removeMarker(this.INVULN_MARKER, this);
            });
        }
        return state;
    }
}
exports.Golisopod = Golisopod;
