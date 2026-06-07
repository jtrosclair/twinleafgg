"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Servine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snivy';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Solar Cutter',
                cost: [G],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.usSetNumber = 'POR 5';
        this.name = 'Servine';
        this.fullName = 'Servine M3';
    }
}
exports.Servine = Servine;
