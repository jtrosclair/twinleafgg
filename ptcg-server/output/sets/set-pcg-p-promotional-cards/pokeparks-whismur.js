"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksWhismur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class PokeParksWhismur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Astonish',
                cost: [C],
                damage: 0,
                text: 'Choose a random card from your opponent\'s hand.Your opponent reveals that card and shuffles it into his or her deck.'
            },
            {
                name: 'Hyper Voice',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Whismur';
        this.fullName = 'PokéPark\'s Whismur PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
exports.PokeParksWhismur = PokeParksWhismur;
