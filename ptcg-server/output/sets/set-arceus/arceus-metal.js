"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusMetal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusMetal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Metal Barrier',
                cost: [M, C, C],
                damage: 40,
                text: 'Prevent all effects of attacks, including damage, done to Arceus by Pokémon LV.X during your opponent\'s next turn.'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR9';
        this.name = 'Arceus';
        this.fullName = 'Arceus Metal AR';
        this.METAL_BARRIER_MARKER = 'METAL_BARRIER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Metal Barrier
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.opponent.marker.addMarker(this.METAL_BARRIER_MARKER, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect
            || effect instanceof attack_effects_1.DealDamageEffect
            || effect instanceof attack_effects_1.PutCountersEffect
            || effect instanceof attack_effects_1.AddSpecialConditionsEffect)
            && effect.player.marker.hasMarker(this.METAL_BARRIER_MARKER, this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.ArceusMetal = ArceusMetal;
