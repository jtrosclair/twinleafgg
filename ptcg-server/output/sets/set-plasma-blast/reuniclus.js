"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Barrier Attack',
                cost: [P],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
            },
            {
                name: 'Telekinesis of Nobility',
                cost: [P, C, C],
                damage: 70,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus PLB';
        this.BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';
        this.CLEAR_BARRIER_ATTACK_MARKER = 'CLEAR_BARRIER_ATTACK_MARKER';
        this.usedTelekinesis = false;
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Barrier Attack - damage reduction marker
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.BARRIER_ATTACK_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this);
        }
        // Intercept incoming damage for Barrier Attack
        // Ref: set-base-set/pluspower.ts (AfterWeaknessAndResistance timing via post-W/R hook)
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (state.phase === game_1.GamePhase.ATTACK && effect.player !== targetOwner) {
                effect.damage = Math.max(0, effect.damage - 30);
            }
        }
        // Cleanup Barrier Attack marker
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_BARRIER_ATTACK_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
            });
        }
        // Attack 2: Telekinesis of Nobility - switch after damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedTelekinesis = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedTelekinesis) {
            this.usedTelekinesis = false;
            const player = effect.player;
            if (player.bench.some(b => b.cards.length > 0)) {
                state = (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player) || state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedTelekinesis = false;
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
