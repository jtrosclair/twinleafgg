"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amoonguss = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Amoonguss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Foongus';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Toxic',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Poisoned Pokémon between turns.'
            },
            {
                name: 'Rising Lunge',
                cost: [G, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage and the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Amoonguss';
        this.fullName = 'Amoonguss NVI';
    }
    reduceEffect(store, state, effect) {
        // Toxic - double poison
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            addSpecialCondition.poisonDamage = 20; // 2 damage counters = 20 damage
            store.reduceEffect(state, addSpecialCondition);
        }
        // Rising Lunge - flip for more damage and paralysis
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 30;
                    const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, addSpecialCondition);
                }
            });
        }
        return state;
    }
}
exports.Amoonguss = Amoonguss;
