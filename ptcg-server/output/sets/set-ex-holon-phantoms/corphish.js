"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Corphish = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Corphish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Corkscrew Punch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Guillotine',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Corphish';
        this.fullName = 'Corphish HP';
    }
}
exports.Corphish = Corphish;
