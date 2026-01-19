"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clamperl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Clamperl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Shell Press',
                cost: [W],
                damage: 10,
                text: 'During your opponent\'s next turn, this Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Clamperl';
        this.fullName = 'Clamperl DRI';
        this.SHELL_PRESS_MARKER = 'SHELL_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Shell Press
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.marker.addMarker(this.SHELL_PRESS_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.marker.hasMarker(this.SHELL_PRESS_MARKER, this)) {
            if (effect.target.getPokemonCard() === this) {
                effect.damage -= 10;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SHELL_PRESS_MARKER, this)) {
            effect.player.marker.removeMarker(this.SHELL_PRESS_MARKER, this);
        }
        return state;
    }
}
exports.Clamperl = Clamperl;
