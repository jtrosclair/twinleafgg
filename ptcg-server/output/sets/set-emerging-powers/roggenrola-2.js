"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roggenrola2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Roggenrola2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Harden',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, if this Pokémon would be damaged by an attack, prevent that attack\'s damage done to this Pokémon if that damage is 40 or less.'
            },
            {
                name: 'Headbutt',
                cost: [F, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Roggenrola';
        this.fullName = 'Roggenrola EPO 49';
        this.HARDEN_MARKER = 'HARDEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.HARDEN_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.HARDEN_MARKER, this)) {
            if (effect.damage <= 40) {
                effect.damage = 0;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.HARDEN_MARKER, this);
        }
        return state;
    }
}
exports.Roggenrola2 = Roggenrola2;
