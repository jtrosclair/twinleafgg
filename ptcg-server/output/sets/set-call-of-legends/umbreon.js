"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Umbreon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Moonlight Fang',
                cost: [D],
                damage: 30,
                text: 'During your opponent\'s next turn, prevent all effects, including damage, done to Umbreon by attacks from your opponent\'s Pokémon that has any Poké-Powers or Poké-Bodies.'
            },
            {
                name: 'Quick Blow',
                cost: [D, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
            }];
        this.set = 'CL';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon';
        this.fullName = 'Umbreon CL';
        this.MOONLIGHT_FANG_MARKER = 'MOONLIGHT_FANG_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.marker.addMarker(this.MOONLIGHT_FANG_MARKER, this);
            (0, prefabs_1.ADD_MARKER)(this.MOONLIGHT_FANG_MARKER, effect.opponent, this);
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect || effect instanceof attack_effects_1.AddSpecialConditionsEffect)
            && effect.target.getPokemonCard() === this
            && ((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers.some(power => (power.powerType === game_1.PowerType.POKEBODY || power.powerType === game_1.PowerType.POKEPOWER)))
            && (state.phase === game_1.GamePhase.ATTACK || state.phase === game_1.GamePhase.AFTER_ATTACK)) {
            if (this.marker.hasMarker(this.MOONLIGHT_FANG_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.MOONLIGHT_FANG_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.MOONLIGHT_FANG_MARKER, effect.player, this);
            this.marker.removeMarker(this.MOONLIGHT_FANG_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_2.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Umbreon = Umbreon;
