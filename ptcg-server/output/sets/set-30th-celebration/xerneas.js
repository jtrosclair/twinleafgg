"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 120;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Geonavigation',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Stadium cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Aurora Horns',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas 30C';
    }
    reduceEffect(store, state, effect) {
        // Geonavigation
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.STADIUM)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked });
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
