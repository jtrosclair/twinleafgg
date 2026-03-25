"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mienshao = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mienshao extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mienfoo';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Feint',
                cost: [C],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }, {
                name: 'High Jump Kick',
                cost: [F, F],
                damage: 50,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mienshao';
        this.fullName = 'Mienshao NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Mienshao = Mienshao;
