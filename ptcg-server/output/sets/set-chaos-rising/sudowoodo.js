"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Sudowoodo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 110;
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Learning Journey',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Book of Transformation, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Rock Hurl',
                cost: [F],
                damage: 30,
                text: 'This attack damage isn\'t affected by Resistance.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.usSetNumber = 'POR 43';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_2.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER, name: 'Book of Transformation' }, { min: 0, max: 2, allowCancel: false }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Sudowoodo = Sudowoodo;
