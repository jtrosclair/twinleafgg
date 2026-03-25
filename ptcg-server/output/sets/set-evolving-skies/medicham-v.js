"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedichamV = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MedichamV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = F;
        this.hp = 210;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Yoga Loop',
                cost: [C, C],
                damage: 0,
                text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon. If your opponent\'s Pokémon is Knocked Out by this attack, take another turn after this one. (Skip Pokémon Checkup.) If 1 of your Pokémon used Yoga Loop during your last turn, this attack can\'t be used.'
            },
            {
                name: 'Smash Uppercut',
                cost: [F, C, C],
                damage: 100,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Medicham V';
        this.fullName = 'Medicham V EVS';
        this.YOGA_LOOP_MARKER = 'YOGA_LOOP_MARKER';
        this.YOGA_LOOP_MARKER_2 = 'YOGA_LOOP_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER_2, this)) {
            // Second turn ending - clear everything
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
            effect.player.usedTurnSkip = false;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
            // First turn ending - mark for cleanup next turn
            effect.player.marker.addMarker(this.YOGA_LOOP_MARKER_2, this);
            // DON'T clear usedTurnSkip here - it needs to stay true for initNextTurn
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if Yoga Loop was used last turn
            if (player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length === 0) {
                    return state;
                }
                const target = targets[0];
                const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                putCountersEffect.target = target;
                state = store.reduceEffect(state, putCountersEffect);
                // Check if target was knocked out
                const targetOwner = state_utils_1.StateUtils.findOwner(state, target);
                const checkHpEffect = new check_effects_1.CheckHpEffect(targetOwner, target);
                store.reduceEffect(state, checkHpEffect);
                if (target.damage >= checkHpEffect.hp) {
                    // Pokémon was knocked out - set marker and enable turn skip
                    player.marker.addMarker(this.YOGA_LOOP_MARKER, this);
                    player.usedTurnSkip = true;
                }
                return state;
            });
        }
        return state;
    }
}
exports.MedichamV = MedichamV;
