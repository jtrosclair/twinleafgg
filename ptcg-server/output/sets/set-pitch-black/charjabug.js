"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charjabug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charjabug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grubbin';
        this.cardType = L;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Vise Grip',
                cost: [L],
                damage: 30,
                text: '',
            },
            {
                name: 'Ram',
                cost: [L, L],
                damage: 50,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '24';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Charjabug';
        this.fullName = 'Charjabug M5';
    }
}
exports.Charjabug = Charjabug;
