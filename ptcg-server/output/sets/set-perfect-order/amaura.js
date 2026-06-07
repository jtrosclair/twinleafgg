"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amaura = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Amaura extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Sail Fossil';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Icy Wind',
                cost: [W, C],
                damage: 50,
                text: 'Your opponent\'s Active Pokemon is now Asleep.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.usSetNumber = 'POR 23';
        this.name = 'Amaura';
        this.fullName = 'Amaura M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Amaura = Amaura;
