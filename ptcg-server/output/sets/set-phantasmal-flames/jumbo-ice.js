"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JumboIce = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class JumboIce extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.name = 'Jumbo Ice Cream';
        this.fullName = 'Jumbo Ice M2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'Heal 80 damage from your Active Pokémon that has 3 or more Energy attached.';
    }
    canPlay(store, state, player) {
        const activePokemon = player.active.getPokemonCard();
        // Must have an active Pokemon
        if (!activePokemon) {
            return false;
        }
        // Must have damage on it
        if (player.active.damage === 0) {
            return false;
        }
        // Must have 3 or more Energy attached
        const energyCount = player.active.energies.cards.length;
        if (energyCount < 3) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const activePokemon = player.active.getPokemonCard();
            if (activePokemon && player.active.damage > 0) {
                // Check if the Pokemon has 3 or more Energy attached
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkEnergy);
                if (checkEnergy.energyMap.length >= 3) {
                    const healEffect = new game_effects_1.HealEffect(player, player.active, 80);
                    store.reduceEffect(state, healEffect);
                }
            }
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.JumboIce = JumboIce;
