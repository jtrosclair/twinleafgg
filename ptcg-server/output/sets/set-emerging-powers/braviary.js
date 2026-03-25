"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Braviary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Braviary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rufflet';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [C, C],
                damage: 40,
                text: ''
            },
            {
                name: 'Brave Bird',
                cost: [C, C, C],
                damage: 90,
                text: 'This Pokémon does 30 damage to itself.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Braviary';
        this.fullName = 'Braviary EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Braviary = Braviary;
