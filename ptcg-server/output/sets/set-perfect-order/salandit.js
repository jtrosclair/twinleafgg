"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fire Claws',
                cost: [R],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.usSetNumber = 'POR 15';
        this.name = 'Salandit';
        this.fullName = 'Salandit M3';
    }
}
exports.Salandit = Salandit;
