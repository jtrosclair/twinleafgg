"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaSlowbroex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaSlowbroex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 330;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Shellnado Spin',
                cost: [P, P, P],
                damage: 180,
                text: 'During your opponent\'s next turn, if this Pokemon takes damage from an attack, put 12 damage counters on the Attacking Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEP';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Slowbro ex';
        this.fullName = 'Mega Slowbro ex MEP';
        this.SHELLNADO_SPIN_MARKER = 'SHELLNADO_SPIN_MARKER';
        this.CLEAR_SHELLNADO_SPIN_MARKER = 'CLEAR_SHELLNADO_SPIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Shellnado Spin - add marker when attack is used
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.SHELLNADO_SPIN_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this);
        }
        // Shellnado Spin - counter-damage during opponent's next turn
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const targetCard = effect.target.getPokemonCard();
            if (targetCard === this && effect.target.marker.hasMarker(this.SHELLNADO_SPIN_MARKER, this)) {
                // Check if damage is from an attack
                if (effect.attackEffect && state.phase === game_1.GamePhase.ATTACK) {
                    const attackingPokemon = effect.source;
                    if (attackingPokemon) {
                        // Put 12 damage counters (120 damage) on the Attacking Pokemon
                        const putCountersEffect = new attack_effects_1.PutCountersEffect(effect.attackEffect, 120);
                        putCountersEffect.target = attackingPokemon;
                        store.reduceEffect(state, putCountersEffect);
                    }
                }
            }
        }
        // Clear marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_SHELLNADO_SPIN_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.SHELLNADO_SPIN_MARKER, this);
            });
        }
        return state;
    }
}
exports.MegaSlowbroex = MegaSlowbroex;
