"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinccinoex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cinccinoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Minccino';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 240;
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Smooth Coat',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If any damage is done to this Pokemon by attacks, flip a coin. If heads, prevent that damage.'
            }];
        this.attacks = [{
                name: 'Energized Slap',
                cost: [C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Cinccino ex';
        this.fullName = 'Cinccino ex M4';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect) && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (state.phase !== state_1.GamePhase.ATTACK)
                return state;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this))
                return state;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    if (effect instanceof attack_effects_1.PutDamageEffect) {
                        effect.preventDefault = true;
                    }
                    else {
                        effect.damage = 0;
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const energyCount = (_b = (_a = effect.source) === null || _a === void 0 ? void 0 : _a.cards.filter((c) => c instanceof energy_card_1.EnergyCard).length) !== null && _b !== void 0 ? _b : 0;
            effect.damage = 40 * energyCount;
        }
        return state;
    }
}
exports.Cinccinoex = Cinccinoex;
