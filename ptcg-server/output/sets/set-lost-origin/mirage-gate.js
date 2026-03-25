"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirageGate = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MirageGate extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.regulationMark = 'F';
        this.name = 'Mirage Gate';
        this.fullName = 'Mirage Gate LOR';
        this.text = `You can use this card only if you have 7 or more cards in the Lost Zone. 

Search your deck for up to 2 basic Energy cards of different types and attach them to your Pokémon in any way you like. Then, shuffle your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            if (player.lostzone.cards.length <= 6) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            /*
             * Legacy pre-prefab implementation:
             * - custom generator + AttachEnergyPrompt from deck
             * - manual "two different energy types" check by comparing selected card names
             * - manual attachment with StateUtils.getTarget
             * - manual deck shuffle prompt
             */
            // Converted to prefab version (ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON).
            (0, prefabs_1.ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON)(store, state, player, 2, 2, {
                destinationSlots: [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE],
                energyFilter: { energyType: card_types_1.EnergyType.BASIC },
                differentTypes: true,
                allowCancel: false,
                min: 0
            });
        }
        return state;
    }
}
exports.MirageGate = MirageGate;
