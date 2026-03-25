"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Litwick extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flare',
                cost: [R],
                damage: 10,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Litwick';
        this.fullName = 'Litwick NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Litwick = Litwick;
