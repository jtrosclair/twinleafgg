"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarrysStaravia = void 0;
const game_1 = require("../../game");
class LarrysStaravia extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.LARRYS];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flap',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Razor Wing',
                cost: [C, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Larry\'s Staravia';
        this.fullName = 'Larry\'s Staravia MC';
    }
}
exports.LarrysStaravia = LarrysStaravia;
