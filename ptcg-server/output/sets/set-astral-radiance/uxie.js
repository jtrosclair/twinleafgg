"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uxie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Uxie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Wise Guidance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a card and put it into your hand. Then, shuffle your deck.'
            }, {
                name: 'Psyshot',
                cost: [P],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Uxie';
        this.fullName = 'Uxie ASR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[0]);
        }
        return state;
    }
}
exports.Uxie = Uxie;
