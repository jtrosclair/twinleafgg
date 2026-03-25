"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piplup = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Piplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Call for Support',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'PFL';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Piplup';
        this.fullName = 'Piplup PFL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked });
        }
        return state;
    }
}
exports.Piplup = Piplup;
