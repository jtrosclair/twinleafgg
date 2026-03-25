"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialgaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DialgaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 180;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Reverse Edge',
                cost: [P, M, C],
                damage: 50,
                text: 'Flip a coin. If heads, put a card from your discard pile into your hand.'
            },
            {
                name: 'Fast Forward',
                cost: [C, C, C, C],
                damage: 90,
                text: 'For each Plasma Energy attached to this Pok\u00e9mon, discard the top card of your opponent\'s deck.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dialga-EX';
        this.fullName = 'Dialga-EX PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.discard.cards.length > 0) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                            if (selected && selected.length > 0) {
                                player.discard.moveCardTo(selected[0], player.hand);
                            }
                        });
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count Plasma Energy attached
            const plasmaCount = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Plasma Energy').length;
            if (plasmaCount > 0 && opponent.deck.cards.length > 0) {
                const cardsToDiscard = Math.min(plasmaCount, opponent.deck.cards.length);
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: cardsToDiscard });
            }
        }
        return state;
    }
}
exports.DialgaEx = DialgaEx;
