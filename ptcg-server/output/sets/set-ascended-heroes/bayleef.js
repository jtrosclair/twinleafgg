"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const game_1 = require("../../game");
class Bayleef extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chikorita';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Leaf Step',
                cost: [G, G],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef MC';
    }
}
exports.Bayleef = Bayleef;
