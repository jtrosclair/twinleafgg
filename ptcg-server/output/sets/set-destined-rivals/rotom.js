"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Astonish',
                cost: [L],
                damage: 20,
                text: 'Choose a random card from your opponent\'s hand. Your opponent reveals it and shuffles it into their deck.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokemon.',
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rotom';
        this.fullName = 'Rotom DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let toolCount = 0;
            [player.active, ...player.bench].forEach(list => {
                list.cards.forEach(card => {
                    if (card instanceof game_1.PokemonCard && card.tools.length > 0) {
                        toolCount += card.tools.length;
                    }
                });
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.Rotom = Rotom;
