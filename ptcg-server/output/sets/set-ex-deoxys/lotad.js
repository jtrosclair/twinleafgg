"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lotad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lotad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Surprise',
                cost: [W],
                damage: 10,
                text: 'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your opponent shuffle that card into his or her deck.'
            }];
        this.set = 'DX';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lotad';
        this.fullName = 'Lotad DX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, [randomCard]), () => []);
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            }
        }
        return state;
    }
}
exports.Lotad = Lotad;
