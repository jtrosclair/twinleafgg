"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phantump = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Phantump extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Astonish',
                cost: [P],
                damage: 0,
                text: 'Choose a random card from your opponent\'s hand. Your opponent ' +
                    'reveals that card and shuffles it into his or her deck.'
            }, {
                name: 'Hook',
                cost: [P, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'XY';
        this.name = 'Phantump';
        this.fullName = 'Phantump XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
                prefabs_1.MOVE_CARD_TO(state, randomCard, opponent.deck);
                prefabs_1.SHUFFLE_DECK(store, state, opponent);
            }
        }
        return state;
    }
}
exports.Phantump = Phantump;
