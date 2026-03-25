"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wooper = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Wooper extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mud Shot',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Tail Whap',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Wooper';
        this.fullName = 'Wooper UF';
    }
}
exports.Wooper = Wooper;
