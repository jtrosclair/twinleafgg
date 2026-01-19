"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naclstack = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Naclstack extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nacli';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Rock Hurl',
                cost: [F, C],
                damage: 0,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Naclstack';
        this.fullName = 'Naclstack M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Naclstack = Naclstack;
