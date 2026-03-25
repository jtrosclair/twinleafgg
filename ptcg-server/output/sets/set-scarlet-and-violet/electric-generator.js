"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricGenerator = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ElectricGenerator extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Electric Generator';
        this.fullName = 'Electric Generator SVI';
        this.text = 'Look at the top 5 cards of your deck and attach up to 2 [L] Energy cards you find there to your Benched [L] Pokémon in any way you like. Shuffle the other cards back into your deck.';
    }
    canPlay(store, state, player) {
        if (player.deck.cards.length === 0) {
            return false;
        }
        let lightningPokemonOnBench = false;
        player.bench.forEach(benchSpot => {
            const card = benchSpot.getPokemonCard();
            if (card && card.cardType === card_types_1.CardType.LIGHTNING) {
                lightningPokemonOnBench = true;
            }
        });
        if (!lightningPokemonOnBench) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let lightningPokemonOnBench = false;
            player.bench.forEach(benchSpot => {
                const card = benchSpot.getPokemonCard();
                if (card && card.cardType === card_types_1.CardType.LIGHTNING) {
                    lightningPokemonOnBench = true;
                }
            });
            if (!lightningPokemonOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            /*
             * Legacy pre-prefab implementation:
             * - moved top 5 cards into a temporary CardList
             * - manually filtered Lightning Energy in that temporary list
             * - ran AttachEnergyPrompt with blocked non-Lightning bench targets
             * - manually returned remaining cards to deck and shuffled
             */
            // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY).
            (0, prefabs_1.LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY)(store, state, player, 5, 2, {
                destinationSlots: [game_1.SlotType.BENCH],
                targetFilter: (_target, pokemonCard) => pokemonCard.cardType === card_types_1.CardType.LIGHTNING,
                energyFilter: { energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' },
                remainderDestination: 'shuffle'
            });
        }
        return state;
    }
}
exports.ElectricGenerator = ElectricGenerator;
