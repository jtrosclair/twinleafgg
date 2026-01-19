"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floatzel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Floatzel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Buizel';
        this.attacks = [
            {
                name: 'Floatify',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put up to 2 Item cards from your discard pile into your hand.'
            },
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.name = 'Floatzel';
        this.fullName = 'Floatzel BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && (card.trainerType !== card_types_1.TrainerType.ITEM)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false, blocked }, this.attacks[0]);
        }
        return state;
    }
}
exports.Floatzel = Floatzel;
