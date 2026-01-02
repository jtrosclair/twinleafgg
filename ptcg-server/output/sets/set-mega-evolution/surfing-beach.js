"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfingBeach = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SurfingBeach extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'MEG';
        this.name = 'Surfing Beach';
        this.fullName = 'Surfing Beach M1S';
        this.regulationMark = 'I';
        this.text = 'Once during each player\'s turn, that player may switch their Active [W] Pokémon with 1 of their Benched [W] Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            let hasBenchWater = false;
            let hasActiveWater = false;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, cardTarget) => {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (cardList === player.active && checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                    hasActiveWater = true;
                }
                if (cardList !== player.active && checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                    hasBenchWater = true;
                }
                else {
                    blocked.push(cardTarget);
                }
            });
            if (!(hasActiveWater && hasBenchWater)) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked }), selected => {
                if (!selected || selected.length === 0)
                    return state;
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        return state;
    }
}
exports.SurfingBeach = SurfingBeach;
