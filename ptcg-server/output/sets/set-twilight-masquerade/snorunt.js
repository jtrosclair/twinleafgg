"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Snorunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Astonish',
                cost: [W, C],
                damage: 20,
                text: 'Choose a random card from your opponent\'s hand. Your opponent ' +
                    'reveals that card and shuffles it into their deck.'
            }];
        this.set = 'TWM';
        this.name = 'Snorunt';
        this.fullName = 'Snorunt TWM';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.setNumber = '51';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, [randomCard]);
                (0, prefabs_1.MOVE_CARD_TO)(state, randomCard, opponent.deck);
                (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            }
        }
        return state;
    }
}
exports.Snorunt = Snorunt;
