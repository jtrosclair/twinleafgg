"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buneary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Buneary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Run Around',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
            },
            {
                name: 'Kick',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Buneary';
        this.fullName = 'Buneary M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
        }
        return state;
    }
}
exports.Buneary = Buneary;
