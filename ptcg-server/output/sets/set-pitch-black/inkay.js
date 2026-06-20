"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inkay = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Inkay extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Procurement',
                cost: [D],
                damage: 0,
                text: 'Search your deck for an Item card and put it into your hand. Then, shuffle your deck.',
            },
            {
                name: 'Spinning Attack',
                cost: [D, D],
                damage: 30,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '49';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Inkay';
        this.fullName = 'Inkay M5';
    }
    reduceEffect(store, state, effect) {
        // Procurement
        // Ref: set-unified-minds/honedge.ts (Lucky Find)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: true });
        }
        return state;
    }
}
exports.Inkay = Inkay;
