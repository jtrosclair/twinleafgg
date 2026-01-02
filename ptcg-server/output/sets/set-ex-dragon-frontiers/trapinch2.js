"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trapinch2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Trapinch2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Dig',
                cost: [P, C],
                damage: 20,
                text: ''
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Trapinch';
        this.fullName = 'Trapinch DF 68';
    }
}
exports.Trapinch2 = Trapinch2;
