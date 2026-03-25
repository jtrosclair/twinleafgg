"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianDecidueyeVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianDecidueyeVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Hisuian Decidueye V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.cardType = F;
        this.hp = 270;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Star of Fortune',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may draw cards until you have 8 cards in your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [{
                name: 'Somersault Feathers',
                cost: [F, C, C],
                damage: 160,
                damageCalculator: '+',
                text: 'You may discard up to 3 Energy cards from your hand. This attack does 30 more damage for each card you discarded in this way.'
            }];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Hisuian Decidueye VSTAR';
        this.fullName = 'Hisuian Decidueye VSTAR ASR';
    }
    reduceEffect(store, state, effect) {
        // Star of Fortune: VSTAR power - draw until you have 8 cards in hand
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.usedVSTAR = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 8);
        }
        // Somersault Feathers: discard up to 3 energy from hand, +30 damage per card discarded
        // Fix: damage must be modified INSIDE the callback since prompt is async
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const attackEffect = effect;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 3 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
                attackEffect.damage += cards.length * 30;
            });
        }
        return state;
    }
}
exports.HisuianDecidueyeVSTAR = HisuianDecidueyeVSTAR;
