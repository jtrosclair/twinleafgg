"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentret = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sentret extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Grope',
                cost: [C],
                damage: 0,
                text: 'Look at the top 2 cards of your deck, choose 1 of them, and put it into your hand. Put the other card on the bottom of your deck.'
            },
            {
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Sentret';
        this.fullName = 'Sentret SW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 2);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
            });
        }
        return state;
    }
}
exports.Sentret = Sentret;
