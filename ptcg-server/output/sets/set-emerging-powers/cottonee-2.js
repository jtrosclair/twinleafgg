"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cottonee2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cottonee2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Cotton Guard',
                cost: [G],
                damage: 10,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Cottonee';
        this.fullName = 'Cottonee EPO 10';
        this.COTTON_GUARD_MARKER = 'COTTON_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.COTTON_GUARD_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.COTTON_GUARD_MARKER, this)) {
            effect.damage = Math.max(0, effect.damage - 10);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.COTTON_GUARD_MARKER, this);
        }
        return state;
    }
}
exports.Cottonee2 = Cottonee2;
