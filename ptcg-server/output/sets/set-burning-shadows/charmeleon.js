"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Heat Blast',
                cost: [R, R, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon BUS';
    }
}
exports.Charmeleon = Charmeleon;
