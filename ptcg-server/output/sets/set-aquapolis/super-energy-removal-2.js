"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperEnergyRemoval2 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class SuperEnergyRemoval2 extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'AQ';
        this.setNumber = '134';
        this.name = 'Super Energy Removal 2';
        this.fullName = 'Super Energy Removal 2 AQ';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Flip 2 coins. If both are heads, discard all Energy cards attached to the Defending Pokémon. If both are tails, discard all Energy cards attached to your Active Pokémon. If 1 is heads and 1 is tails, this card does nothing.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.preventDefault = true;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, result => {
                if (result[0] && result[1]) {
                    // Both heads: Discard all Energy from Defending Pokémon
                    const cards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.active, opponent.discard, { cards, sourceCard: this });
                }
                else if (!result[0] && !result[1]) {
                    // Both tails: Discard all Energy from Active Pokémon
                    const cards = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.discard, { cards, sourceCard: this });
                }
            });
        }
        return state;
    }
}
exports.SuperEnergyRemoval2 = SuperEnergyRemoval2;
