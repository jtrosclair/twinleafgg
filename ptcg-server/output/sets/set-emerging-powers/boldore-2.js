"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boldore2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Boldore2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roggenrola';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Hard Crash',
                cost: [F, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage. If tails, this Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Boldore';
        this.fullName = 'Boldore EPO 52';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        return state;
    }
}
exports.Boldore2 = Boldore2;
