"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duosion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Duosion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Solosis';
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Duosion';
        this.fullName = 'Duosion NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Duosion = Duosion;
