"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chinchou2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Chinchou2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Float',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Chinchou.'
            },
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Chinchou';
        this.fullName = 'Chinchou AQ 70';
        this.FLOAT_MARKER = 'FLOAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.FLOAT_MARKER, this);
                    prefabs_1.ADD_MARKER(this.FLOAT_MARKER, effect.opponent, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.FLOAT_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.FLOAT_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.FLOAT_MARKER, effect.player, this);
            this.marker.removeMarker(this.FLOAT_MARKER, this);
        }
        return state;
    }
}
exports.Chinchou2 = Chinchou2;
