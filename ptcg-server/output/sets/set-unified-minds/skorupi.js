"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skorupi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skorupi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Knock Off',
                cost: [C, C],
                damage: 0,
                text: 'Discard a random card from your opponent\'s hand.'
            },
            {
                name: 'Bug Bite',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skorupi';
        this.fullName = 'Skorupi UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Knock Off
        // Ref: set-unbroken-bonds/purugly.ts (Stray Cat Dash - discard random card from opponent's hand)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Skorupi = Skorupi;
