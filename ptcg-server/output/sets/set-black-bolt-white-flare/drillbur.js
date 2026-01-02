"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drillbur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Drillbur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mud-Slap',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Corkscrew Punch',
                cost: [F, F],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Drillbur';
        this.fullName = 'Drillbur SV11B';
    }
}
exports.Drillbur = Drillbur;
