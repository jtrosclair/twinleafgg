"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkPatch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkPatch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Dark Patch';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.fullName = 'Dark Patch ASR';
        this.text = 'Attach a basic [D] Energy card from your discard pile to 1 of your ' +
            'Benched [D] Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.DARK);
            });
            if (!hasEnergyInDiscard) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const hasDarkPokemonOnBench = player.bench.some(bench => {
                const pokemonCard = bench.getPokemonCard();
                return pokemonCard !== undefined && pokemonCard.cardType === card_types_1.CardType.DARK;
            });
            if (!hasDarkPokemonOnBench) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            /*
             * Legacy pre-prefab implementation:
             * - scanned bench and built blocked CardTargets manually
             * - ran a direct AttachEnergyPrompt from discard to bench
             * - moved cards with MOVE_CARDS + StateUtils target resolution
             * - manually cleaned up trainer slot after prompt resolution
             */
            // Converted to prefab version (ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON).
            (0, prefabs_1.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON)(store, state, player, 1, card_types_1.CardType.DARK, {
                destinationSlots: [play_card_action_1.SlotType.BENCH],
                targetFilter: (_target, pokemonCard) => pokemonCard.cardType === card_types_1.CardType.DARK,
                energyFilter: { energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' },
                min: 1,
                allowCancel: false
            });
        }
        return state;
    }
}
exports.DarkPatch = DarkPatch;
