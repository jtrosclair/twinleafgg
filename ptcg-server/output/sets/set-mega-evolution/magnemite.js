"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Beam',
                cost: [L],
                damage: 10,
                text: ''
            }];
        this.set = 'MEG';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite M1S';
        this.setNumber = '45';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Magnemite = Magnemite;
