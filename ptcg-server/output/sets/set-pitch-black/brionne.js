"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brionne = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Brionne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Popplio';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hyper Voice',
                cost: [W],
                damage: 40,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '18';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Brionne';
        this.fullName = 'Brionne M5';
    }
}
exports.Brionne = Brionne;
