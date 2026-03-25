"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Stretch Vine',
                cost: [C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Benched Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Sharp Leaf',
                cost: [G, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage.'
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur CG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Ivysaur = Ivysaur;
