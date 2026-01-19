"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyRecycleSystem = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const select_option_prompt_1 = require("../../game/store/prompts/select-option-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EnergyRecycleSystem extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CES';
        this.setNumber = '128';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Energy Recycle System';
        this.fullName = 'Energy Recycle System CES';
        this.text = `Choose 1: 
  
  • Put a basic Energy card from your discard pile into your hand.
  • Shuffle 3 basic Energy cards from your discard pile into your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Find all basic Energy cards in discard
            const basicEnergies = player.discard.cards.filter(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergies.length === 0) {
                // No valid targets
                return state;
            }
            // Show the options prompt
            state = store.prompt(state, new select_option_prompt_1.SelectOptionPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, [
                'Put a basic Energy card from your discard pile into your hand.',
                'Shuffle 3 basic Energy cards from your discard pile into your deck.'
            ], { allowCancel: false }), choice => {
                if (choice === 0) {
                    // Option 1: Put 1 basic Energy into hand
                    state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
                        }
                    });
                }
                else if (choice === 1) {
                    // Option 2: Shuffle 3 basic Energy into deck
                    if (basicEnergies.length < 3) {
                        // Not enough to choose 3
                        return;
                    }
                    state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 3, allowCancel: false }), selected => {
                        if (selected && selected.length === 3) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: selected.map(c => c.name).join(', ') });
                            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: selected, sourceCard: this, sourceEffect: this.attacks[1] });
                            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                        }
                    });
                }
            });
            return state;
        }
        return state;
    }
}
exports.EnergyRecycleSystem = EnergyRecycleSystem;
