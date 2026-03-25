"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blitzle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Blitzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{
                type: F
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Rear Kick', cost: [L, C], damage: 20, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Blitzle';
        this.fullName = 'Blitzle BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
    }
}
exports.Blitzle = Blitzle;
