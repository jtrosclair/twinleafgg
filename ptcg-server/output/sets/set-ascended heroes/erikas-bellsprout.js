"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasBellsprout = void 0;
const game_1 = require("../../game");
class ErikasBellsprout extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.ERIKAS];
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Vine Slap',
                cost: [G],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Erika\'s Bellsprout';
        this.fullName = 'Erika\'s Bellsprout MC';
    }
}
exports.ErikasBellsprout = ErikasBellsprout;
