"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pansear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{
                type: W
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Scratch', cost: [C], damage: 10, text: '' },
            { name: 'Live Coal', cost: [R, C, C], damage: 30, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Pansear';
        this.fullName = 'Pansear BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
    }
}
exports.Pansear = Pansear;
