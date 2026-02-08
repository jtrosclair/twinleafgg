"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fletchinder = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Fletchinder extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fletchling';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flare',
                cost: [R, R],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Fletchinder';
        this.fullName = 'Fletchinder M3';
    }
}
exports.Fletchinder = Fletchinder;
