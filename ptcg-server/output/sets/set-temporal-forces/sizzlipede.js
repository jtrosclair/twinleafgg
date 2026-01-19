"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sizzlipede = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sizzlipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Heat Dive',
                cost: [R],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Sizzlipede';
        this.fullName = 'Sizzlipede TEF';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Sizzlipede = Sizzlipede;
