"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gimmighoul = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Gimmighoul extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slap',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Gimmighoul';
        this.fullName = 'Gimmighoul M1L';
        this.regulationMark = 'I';
    }
}
exports.Gimmighoul = Gimmighoul;
