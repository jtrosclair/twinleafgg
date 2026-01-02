"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P, value: 20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Steady Punch',
                cost: [F],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.',
            },
            {
                name: 'Brick Break',
                cost: [F, C],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.',
            }
        ];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Machoke';
        this.fullName = 'Machoke SF';
    }
    reduceEffect(store, state, effect) {
        // Steady Punch
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        // Brick Break
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.ignoreResistance = true;
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
        }
        return state;
    }
}
exports.Machoke = Machoke;
