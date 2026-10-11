"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpeko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Morpeko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Select a Snack',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard the top 3 cards of your deck and put 1 of them into your hand.'
            },
            {
                name: 'Slap',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Morpeko';
        this.fullName = 'Morpeko 30C';
    }
    reduceEffect(store, state, effect) {
        // Select a Snack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, deckTop, { count: Math.min(3, player.deck.cards.length), sourceCard: this });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, player.hand, { cards: selected || [], sourceCard: this });
                (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, player.discard, { sourceCard: this });
            });
        }
        return state;
    }
}
exports.Morpeko = Morpeko;
