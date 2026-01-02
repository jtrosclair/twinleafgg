"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftoversGE = exports.RareCandyGE = void 0;
const leftovers_1 = require("../set-pokemon-151/leftovers");
const rare_candy_1 = require("../set-ex-holon-phantoms/rare-candy");
class RareCandyGE extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.fullName = 'Rare Candy GE';
        this.name = 'Rare Candy';
        this.set = 'GE';
        this.setNumber = '102';
        this.text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';
    }
}
exports.RareCandyGE = RareCandyGE;
class LeftoversGE extends leftovers_1.Leftovers {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.fullName = 'Leftovers GE';
        this.set = 'GE';
    }
}
exports.LeftoversGE = LeftoversGE;
