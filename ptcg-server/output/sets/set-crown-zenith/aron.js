"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aron = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aron extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Ram',
                cost: [M],
                damage: 10,
                text: ''
            },
            {
                name: 'Slight Intrusion',
                cost: [C, C],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Aron';
        this.fullName = 'Aron CRZ';
        this.regulationMark = 'F';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        return state;
    }
}
exports.Aron = Aron;
