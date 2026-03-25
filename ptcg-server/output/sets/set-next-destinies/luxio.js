"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Luxio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shinx';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Jump On',
                cost: [L],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            },
            {
                name: 'Wild Charge',
                cost: [L, C, C],
                damage: 60,
                text: 'This Pokémon does 10 damage to itself.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '44';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Luxio';
        this.fullName = 'Luxio NXD';
    }
    reduceEffect(store, state, effect) {
        // Jump On
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        // Wild Charge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Luxio = Luxio;
