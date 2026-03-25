"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swanna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Swanna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ducklett';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wing Dance',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Air Slash',
                cost: [W, C, C],
                damage: 70,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Swanna';
        this.fullName = 'Swanna EPO';
        this.WING_DANCE_MARKER = 'WING_DANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.active.marker.addMarker(this.WING_DANCE_MARKER, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        // Prevent damage and effects
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.marker.hasMarker(this.WING_DANCE_MARKER, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const attacker = effect.player;
            if (player !== attacker) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.WING_DANCE_MARKER, this);
        }
        return state;
    }
}
exports.Swanna = Swanna;
