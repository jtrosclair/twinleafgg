"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSpaceDistortion = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TimeSpaceDistortion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'MT';
        this.name = 'Time-Space Distortion';
        this.fullName = 'Time-Space Distortion MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.text = 'Flip 3 coins. For each heads, search your discard pile for a Pokémon, show it to your opponent, and put it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            // Player has no Pokemons in the discard pile
            if (!player.discard.cards.some(c => c.superType === card_types_1.SuperType.POKEMON)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let headsCount = 0;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, (results) => {
                results.forEach(result => {
                    if (result) {
                        headsCount++;
                    }
                });
                if (headsCount === 0) {
                    return state;
                }
                const minDiscard = Math.min(player.discard.cards.filter(c => c.superType === card_types_1.SuperType.POKEMON).length, headsCount);
                store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: minDiscard, max: headsCount, allowCancel: false }), selected => {
                    if (selected && selected.length > 0) {
                        // Discard trainer only when user selected a Pokemon
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        // Recover discarded Pokemon
                        player.discard.moveCardsTo(selected, player.hand);
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            });
        }
        return state;
    }
}
exports.TimeSpaceDistortion = TimeSpaceDistortion;
