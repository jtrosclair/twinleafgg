"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mountain RAMMING',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 50,
                text: 'Discard the top card of your opponent\'s deck.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Machoke';
        this.fullName = 'Machoke MEW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.deck.cards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
            }
        }
        return state;
    }
}
exports.Machoke = Machoke;
