"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Durant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Durant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Energy Digging',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Durant';
        this.fullName = 'Durant SIT';
    }
    reduceEffect(store, state, effect) {
        // Copied from Gimmighoul SSP's Minor Errand-Running
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.deck.cards.length === 0) {
                return state;
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                player.deck.moveCardsTo(cards, player.hand);
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Durant = Durant;
