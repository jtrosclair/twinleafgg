"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dedenne = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dedenne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Return',
                cost: [C],
                damage: 20,
                text: 'You may draw cards until you have 6 cards in your hand.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Dedenne';
        this.fullName = 'Dedenne UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 6);
        }
        return state;
    }
}
exports.Dedenne = Dedenne;
