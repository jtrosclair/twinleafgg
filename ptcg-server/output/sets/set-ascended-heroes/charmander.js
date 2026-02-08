"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const game_1 = require("../../game");
class Charmander extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fire Claws',
                cost: [R, C],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Charmander';
        this.fullName = 'Charmander MC';
    }
}
exports.Charmander = Charmander;
