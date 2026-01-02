"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DARK;
        this.regulationMark = 'H';
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [game_1.CardType.DARK],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel PRE';
    }
}
exports.Sneasel = Sneasel;
