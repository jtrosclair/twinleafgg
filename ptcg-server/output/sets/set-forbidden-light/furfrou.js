"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Furfrou = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Furfrou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Return',
                cost: [C],
                damage: 20,
                text: 'You may draw cards until you have 5 cards in your hand.'
            }];
        this.set = 'FLI';
        this.name = 'Furfrou';
        this.fullName = 'Furfrou FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 5);
                }
            });
        }
        return state;
    }
}
exports.Furfrou = Furfrou;
