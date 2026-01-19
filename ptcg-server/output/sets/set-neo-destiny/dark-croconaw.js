"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkCroconaw = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class DarkCroconaw extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.tags = [card_types_1.CardTag.DARK];
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Clamping Jaw',
                cost: [W, W],
                damage: 20,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn. If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing. (Benching either Pokémon ends this effect.)'
            }];
        this.set = 'N4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Dark Croconaw';
        this.fullName = 'Dark Croconaw N4';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
        this.SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Clamping Jaw
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SMOKESCREEN_MARKER, this);
        // Smokescreen
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.SMOKESCREEN_MARKER, opponent, this)) {
                return state; // Avoids recursion
            }
            effect.preventDefault = true;
            (0, prefabs_1.ADD_MARKER)(this.SMOKESCREEN_MARKER, opponent, this); // Avoids recursion
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, effect.attack);
                    store.reduceEffect(state, useAttackEffect);
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                }
            });
        }
        return state;
    }
}
exports.DarkCroconaw = DarkCroconaw;
