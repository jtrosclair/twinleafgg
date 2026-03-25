"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beheeyem = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Beheeyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Elgyem';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Brain Control',
                cost: [P],
                damage: 0,
                text: 'Your opponent reveals his or her hand. Choose a card from there and put it on the bottom of your opponent\'s deck.'
            },
            {
                name: 'Psybeam',
                cost: [P, C, C],
                damage: 40,
                text: 'The Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beheeyem';
        this.fullName = 'Beheeyem NXD';
    }
    reduceEffect(store, state, effect) {
        // Brain Control - reveal hand and put one card on bottom of deck
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            // Show opponent's hand to player, then choose a card
            return store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(player.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                // Choose a card to put on bottom of deck
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, {}, { min: 1, max: 1, allowCancel: false }), (selected) => {
                    if (selected && selected.length > 0) {
                        // Move chosen card to bottom of opponent's deck
                        opponent.hand.moveCardsTo(selected, opponent.deck);
                        // Move the card to the bottom (index 0 is bottom)
                        const card = selected[0];
                        const index = opponent.deck.cards.indexOf(card);
                        if (index > -1) {
                            opponent.deck.cards.splice(index, 1);
                            opponent.deck.cards.unshift(card);
                        }
                    }
                });
            });
        }
        // Psybeam - confusion
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Beheeyem = Beheeyem;
