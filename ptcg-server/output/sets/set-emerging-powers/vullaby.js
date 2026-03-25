"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vullaby = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Vullaby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rear Guard',
                cost: [D],
                damage: 0,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
            },
            {
                name: 'Gust',
                cost: [D, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Vullaby';
        this.fullName = 'Vullaby EPO';
        this.REAR_GUARD_MARKER = 'REAR_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.REAR_GUARD_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.REAR_GUARD_MARKER, this)) {
            effect.damage = Math.max(0, effect.damage - 30);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.REAR_GUARD_MARKER, this);
        }
        return state;
    }
}
exports.Vullaby = Vullaby;
