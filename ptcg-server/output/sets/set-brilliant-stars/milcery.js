"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Milcery = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Milcery extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Lead',
                cost: [P],
                damage: 0,
                text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Ram',
                cost: [P],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Milcery';
        this.fullName = 'Milcery BRS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && (card.trainerType !== card_types_1.TrainerType.SUPPORTER)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.attacks[0]);
        }
        return state;
    }
}
exports.Milcery = Milcery;
