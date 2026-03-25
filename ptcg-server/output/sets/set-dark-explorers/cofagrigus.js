"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Cofagrigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Chuck',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Discard as many Pokémon Tool cards as you like from your hand. This attack does 40 damage times the number of cards you discarded.'
            },
            {
                name: 'Lock Up',
                cost: [P, P],
                damage: 40,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus DEX';
    }
    reduceEffect(store, state, effect) {
        // Chuck - discard Tool cards from hand for damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Find Tool cards in hand
            const toolCards = player.hand.cards.filter(card => card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL);
            // If no Tool cards, do 0 damage
            if (toolCards.length === 0) {
                effect.damage = 0;
                return state;
            }
            // Let player choose how many Tool cards to discard
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 0, max: toolCards.length, allowCancel: false }), (selected) => {
                const cards = selected || [];
                // Discard the selected cards
                cards.forEach(card => {
                    player.hand.moveCardTo(card, player.discard);
                });
                // Calculate damage: 40 x number of cards discarded
                effect.damage = 40 * cards.length;
            });
        }
        // Lock Up - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Cofagrigus = Cofagrigus;
