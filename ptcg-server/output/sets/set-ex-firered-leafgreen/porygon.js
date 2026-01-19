"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Data Retrieval',
                cost: [C],
                damage: 0,
                text: 'If you have less than 4 cards in your hand, draw cards until you have 4 cards in your hand.'
            },
            {
                name: 'Confuse Ray',
                cost: [C, C],
                damage: 10,
                text: 'The Defending Pokémon is now Confused.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Porygon';
        this.fullName = 'Porygon RG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(effect.player, 4);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Porygon = Porygon;
