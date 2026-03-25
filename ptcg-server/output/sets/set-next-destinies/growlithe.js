"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Growlithe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Growlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Combustion',
                cost: [R, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Growlithe';
        this.fullName = 'Growlithe NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Growlithe = Growlithe;
