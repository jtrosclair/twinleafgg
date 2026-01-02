"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Corphish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Corphish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Vice Grip',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Take Down',
                cost: [C, C],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Corphish';
        this.fullName = 'Corphish M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        return state;
    }
}
exports.Corphish = Corphish;
