"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Makuhita = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Makuhita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Corkscrew Punch',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Confront',
                cost: [F, F],
                damage: 30,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Makuhita';
        this.fullName = 'Makuhita M1L';
        this.regulationMark = 'I';
    }
}
exports.Makuhita = Makuhita;
