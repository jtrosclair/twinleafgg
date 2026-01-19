"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.retreat = [C];
        this.powers = [{
                name: 'Focus Wall',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Mr. Mime would be Knocked Out by damage from an attack that does 70 or more damage (after applying Weakness and Resistance), Mr. Mime is not Knocked Out and its remaining HP becomes 10 instead.'
            }];
        this.attacks = [{
                name: 'Desperate Slap',
                cost: [P, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If Mr. Mime already has 5 or more damage counters on it, this attack does 20 damage plus 40 more damage.'
            }];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime SV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.damage >= 70) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= checkHpEffect.hp) {
                if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                    return state;
                }
                effect.surviveOnTenHPReason = this.powers[0].name;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.damage >= 50) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.MrMime = MrMime;
