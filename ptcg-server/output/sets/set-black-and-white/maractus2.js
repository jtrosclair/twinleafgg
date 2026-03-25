"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maractus2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Maractus2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Constant Rattle',
                cost: [G],
                damage: 0,
                text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 damage. If 2 of them are heads, this attack does 30 damage. If all of them are heads, this attack does 60 damage.'
            },
            {
                name: 'Giga Drain',
                cost: [G, G, G],
                damage: 50,
                text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Maractus';
        this.fullName = 'Maractus BLW 12';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 3, results => {
                const heads = results.filter(r => r).length;
                if (heads === 1) {
                    effect.damage = 10;
                }
                else if (heads === 2) {
                    effect.damage = 30;
                }
                else if (heads === 3) {
                    effect.damage = 60;
                }
                else {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Heal after damage is dealt
            const afterDamage = new attack_effects_2.AfterDamageEffect(effect, effect.damage);
            state = store.reduceEffect(state, afterDamage);
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect.damage, effect, store, state);
        }
        return state;
    }
}
exports.Maractus2 = Maractus2;
