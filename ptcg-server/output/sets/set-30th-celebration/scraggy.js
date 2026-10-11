"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Find Fault',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Your opponent shuffles their hand into their deck. Then, your opponent draws 4 cards.'
            },
            {
                name: 'Headbutt',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy 30C';
    }
    reduceEffect(store, state, effect) {
        // Find Fault
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { sourceCard: this });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            (0, prefabs_1.DRAW_CARDS)(opponent, 4);
        }
        return state;
    }
}
exports.Scraggy = Scraggy;
