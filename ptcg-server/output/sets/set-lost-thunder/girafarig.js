"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Girafarig = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Girafarig extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.PSYCHIC }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Get Lost',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 2 cards from your opponent\'s discard pile in the Lost Zone.'
            },
            {
                name: 'Mind Shock',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }
        ];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Girafarig';
        this.fullName = 'Girafarig LOT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // Get Lost
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.discard, {}, { min: 2, max: 2 }), selected => {
                if (selected) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.discard, opponent.lostzone, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Mind Shock
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Girafarig = Girafarig;
