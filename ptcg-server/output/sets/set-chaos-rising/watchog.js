"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watchog = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Watchog extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Patrat';
        this.hp = 100;
        this.cardType = C;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Unannounced Check',
                cost: [C, C],
                damage: 50,
                text: 'Flip 3 coins. For each heads, look at your opponent\'s hand and choose a card there. Your opponent shuffles those cards into their deck. This attack does 50 damage to 1 of your opponent\'s Pokemon. (Apply Weakness and Resistance for Benched Pokemon.)'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.usSetNumber = 'CRI 69';
        this.name = 'Watchog';
        this.fullName = 'Watchog M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                if (heads > 0 && opponent.hand.cards.length > 0) {
                    const maxChoose = Math.min(heads, opponent.hand.cards.length);
                    return store.prompt(state, new game_2.ChooseCardsPrompt(player, game_2.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: 0, max: maxChoose, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards, sourceCard: this, sourceEffect: effect });
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                        }
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Watchog = Watchog;
