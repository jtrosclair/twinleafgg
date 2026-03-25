"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Skitty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cat Kick',
                cost: [C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Skitty';
        this.fullName = 'Skitty ASC';
    }
}
exports.Skitty = Skitty;
