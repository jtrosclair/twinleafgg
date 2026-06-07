"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bunnelby = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bunnelby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Smash Kick',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.usSetNumber = 'POR 64';
        this.name = 'Bunnelby';
        this.fullName = 'Bunnelby M3';
    }
}
exports.Bunnelby = Bunnelby;
