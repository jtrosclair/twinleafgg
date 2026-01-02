"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venonat = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venonat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Radar Eyes',
                cost: [G],
                damage: 0,
                text: 'Look at the top 7 cards of your deck and put 1 of them into your hand. Shuffle the other cards back into your deck.'
            },
            {
                name: 'Flop',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Venonat';
        this.fullName = 'Venonat UNB';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 7);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                prefabs_1.MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected });
                deckTop.moveTo(player.deck);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        return state;
    }
}
exports.Venonat = Venonat;
