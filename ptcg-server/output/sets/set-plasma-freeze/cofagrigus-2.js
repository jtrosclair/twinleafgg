"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Cofagrigus2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Elongating Arms',
                cost: [C],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Crazy Slap',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 40 damage times the number of heads.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus PLF 57';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Cofagrigus2 = Cofagrigus2;
