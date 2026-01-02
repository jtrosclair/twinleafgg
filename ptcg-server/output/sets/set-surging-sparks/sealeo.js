"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sealeo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sealeo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spheal';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Lunge Out',
                cost: [W],
                damage: 30,
                text: ''
            },
            {
                name: 'Ice Ball',
                cost: [W, W],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Sealeo';
        this.fullName = 'Sealeo SSP';
    }
}
exports.Sealeo = Sealeo;
