"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Qwilfish = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const state_1 = require("../../game/store/state/state");
class Qwilfish extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 90;
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Poison Point',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon is in the Active Spot and takes damage from an attack from your opponent\'s Pokemon, the Attacking Pokemon is now Poisoned.'
            }];
        this.attacks = [{
                name: 'Venoshock',
                cost: [D],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokemon is Poisoned, this attack does 50 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Qwilfish';
        this.fullName = 'Qwilfish M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this && state.phase === state_1.GamePhase.ATTACK) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, targetOwner);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetOwner, this)) {
                return state;
            }
            if (effect.player === opponent && effect.damage > 0) {
                (0, prefabs_2.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.Qwilfish = Qwilfish;
