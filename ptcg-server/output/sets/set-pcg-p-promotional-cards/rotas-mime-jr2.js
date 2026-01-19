"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotasMimeJr2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RotasMimeJr2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Barrier Attack',
                cost: [P, C],
                damage: 20,
                text: 'Damage done to Rota\'s Mime Jr.by your opponent\'s next attack is reduced by 30 (after applying Weakness and Resistance).'
            }];
        this.set = 'PCGP';
        this.name = 'Rota\'s Mime Jr.';
        this.fullName = 'Rota\'s Mime Jr. PCGP 97';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.marker.addMarker(this.BARRIER_ATTACK_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {
            if (effect.target.getPokemonCard() === this) {
                effect.damage -= 10;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.RotasMimeJr2 = RotasMimeJr2;
