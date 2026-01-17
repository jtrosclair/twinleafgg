"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delibird = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Delibird extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Quick Gift',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If you go first, you can use this attack during your first turn. Search your deck for a card and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Gentle Slap',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'ME1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Delibird';
        this.fullName = 'Delibird ME1';
    }
    reduceEffect(store, state, effect) {
        // Quick Gift attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check if it's the first turn and player went first
            if (state.turn !== 1 || state.players[0] !== player) {
                return state;
            }
            // Check if deck has cards
            if (player.deck.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Delibird = Delibird;
