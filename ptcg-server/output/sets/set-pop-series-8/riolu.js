"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Riolu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Inner Focus',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Riolu can\'t be Paralyzed.'
            }];
        this.attacks = [{
                name: 'Quick Attack',
                cost: [F],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
            }];
        this.set = 'P8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Riolu';
        this.fullName = 'Riolu P8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED) && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_2.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Riolu = Riolu;
