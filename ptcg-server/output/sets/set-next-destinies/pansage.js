"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansage = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pansage extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Seed Bomb',
                cost: [G, C],
                damage: 30,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pansage';
        this.fullName = 'Pansage NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Pansage = Pansage;
