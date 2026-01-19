"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teddiursa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Teddiursa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Teary Eyes',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, any damage done to Teddiursa by attacks is reduced by 20 (after applying Weakness and Resistance).'
            },
            {
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'UF';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Teddiursa';
        this.fullName = 'Teddiursa UF';
        this.TEARY_EYES_MARKER = 'TEARY_EYES_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.marker.addMarker(this.TEARY_EYES_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.marker.hasMarker(this.TEARY_EYES_MARKER, this)) {
            if (effect.target.getPokemonCard() === this) {
                effect.damage -= 20;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TEARY_EYES_MARKER, this)) {
            effect.player.marker.removeMarker(this.TEARY_EYES_MARKER, this);
        }
        return state;
    }
}
exports.Teddiursa = Teddiursa;
