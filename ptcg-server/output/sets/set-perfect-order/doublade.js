"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doublade = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Doublade extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Honedge';
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Sword Stash',
                cost: [C, C],
                damage: 0,
                text: 'You may reveal any number of Honedge, Doublade, and Aegislash from your hand. This attack does 60 damage for each card you revealed.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.usSetNumber = 'POR 57';
        this.name = 'Doublade';
        this.fullName = 'Doublade M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Find indices of cards that should be blocked (not Honedge, Doublade, or Aegislash)
            const blockedIndices = [];
            player.hand.cards.forEach((card, index) => {
                if (!(card instanceof game_1.PokemonCard) ||
                    (card.name !== 'Honedge' && card.name !== 'Doublade' && card.name !== 'Aegislash')) {
                    blockedIndices.push(index);
                }
            });
            // Check if there are any valid cards
            const validCards = player.hand.cards.filter(card => card instanceof game_1.PokemonCard &&
                (card.name === 'Honedge' || card.name === 'Doublade' || card.name === 'Aegislash'));
            if (validCards.length === 0) {
                effect.damage = 0;
                return state;
            }
            let revealedCards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.hand, {}, { min: 0, max: validCards.length, allowCancel: false, blocked: blockedIndices }), selected => {
                revealedCards = selected || [];
                // Show revealed cards to opponent
                if (revealedCards.length > 0) {
                    store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, revealedCards), () => state);
                }
                // Calculate damage
                effect.damage = revealedCards.length * 60;
            });
        }
        return state;
    }
}
exports.Doublade = Doublade;
