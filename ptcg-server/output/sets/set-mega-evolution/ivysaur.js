"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Razor Leaf',
                cost: [G, G],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur M1L';
    }
}
exports.Ivysaur = Ivysaur;
