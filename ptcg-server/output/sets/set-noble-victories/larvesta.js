"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Larvesta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Larvesta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Take Down',
                cost: [C, C],
                damage: 30,
                text: 'This Pokémon does 10 damage to itself.'
            }];
        this.set = 'NVI';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Larvesta';
        this.fullName = 'Larvesta NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Larvesta = Larvesta;
