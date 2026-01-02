"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaosGym = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class ChaosGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Chaos Gym';
        this.fullName = 'Chaos Gym G2';
        this.text = 'Whenever a player plays a Trainer card other than a Stadium card, he or she flips a coin. If heads, that player plays that card normally. If tails, the player can\'t play that card. If the card isn\'t put into play, the player\'s opponent may use that card instead, if he or she does everything required in order to play that card (like discarding cards).Either way, the card goes to its owner\'s discard pile.';
        this.CHAOS_GYM_MARKER = 'CHAOS_GYM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.PlaySupporterEffect) && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // avoid recursion if Chaos Gym is already in effect
            if (prefabs_1.HAS_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard)) {
                return state;
            }
            effect.preventDefault = true;
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.supporter);
            // Add a marker to the player to indicate that Chaos Gym is in effect
            prefabs_1.ADD_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard, this);
            // Flip a coin to see if the player can play the Trainer card
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, effect.trainerCard);
                    store.reduceEffect(state, playTrainerEffect);
                }
                else {
                    // Just can't use if put into play
                    if (effect.trainerCard.putIntoPlay || effect.trainerCard.trainerType === card_types_1.TrainerType.TOOL) {
                        prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
                        return state;
                    }
                    // If tails, opponent can use the Trainer card if they want
                    prefabs_1.CONFIRMATION_PROMPT(store, state, opponent, result => {
                        if (result) {
                            const playTrainerEffect = new play_card_effects_1.TrainerEffect(opponent, effect.trainerCard);
                            store.reduceEffect(state, playTrainerEffect);
                        }
                    }, game_1.GameMessage.WANT_TO_USE_ABILITY);
                }
            });
            // Regardless of the outcome, the Trainer card goes to the discard pile
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
            // Remove the Chaos Gym marker after resolving (idk how to do this)
        }
        return state;
    }
}
exports.ChaosGym = ChaosGym;
// import { Effect } from '../../game/store/effects/effect';
// import { State } from '../../game/store/state/state';
// import { StoreLike } from '../../game/store/store-like';
// import { TrainerCard } from '../../game/store/card/trainer-card';
// import { TrainerType } from '../../game/store/card/card-types';
// import { StateUtils } from '../../game/store/state-utils';
// import { PlayItemEffect, PlaySupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
// import { ADD_MARKER, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, HAS_MARKER, MOVE_CARD_TO, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
// import { GameMessage } from '../../game';
// export class ChaosGym extends TrainerCard {
//   public trainerType: TrainerType = TrainerType.STADIUM;
//   public set: string = 'G2';
//   public cardImage: string = 'assets/cardback.png';
//   public setNumber: string = '102';
//   public name: string = 'Chaos Gym';
//   public fullName: string = 'Chaos Gym G2';
//   public text: string =
//     'Whenever a player plays a Trainer card other than a Stadium card, he or she flips a coin. If heads, that player plays that card normally. If tails, the player can\'t play that card. If the card isn\'t put into play, the player\'s opponent may use that card instead, if he or she does everything required in order to play that card (like discarding cards).Either way, the card goes to its owner\'s discard pile.';
//   public readonly CHAOS_GYM_MARKER = 'CHAOS_GYM_MARKER';
//   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
//     if ((effect instanceof PlayItemEffect || effect instanceof PlaySupporterEffect) && StateUtils.getStadiumCard(state) === this) {
//       const player = effect.player;
//       const opponent = StateUtils.getOpponent(state, player);
//       // avoid recursion if Chaos Gym is already in effect
//       if (HAS_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard)) {
//         return state;
//       }
//       effect.preventDefault = true;
//       MOVE_CARD_TO(state, effect.trainerCard, player.supporter);
//       // Add a marker to the player to indicate that Chaos Gym is in effect
//       ADD_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard, this);
//       // Flip a coin to see if the player can play the Trainer card
//       COIN_FLIP_PROMPT(store, state, player, result => {
//         if (result) {
//           const playTrainerEffect = new TrainerEffect(player, effect.trainerCard);
//           store.reduceEffect(state, playTrainerEffect);
//           // Remove the Chaos Gym marker after resolving
//           REMOVE_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard, this);
//           // Move the Trainer card to the discard pile
//           MOVE_CARD_TO(state, effect.trainerCard, player.discard);
//         } else {
//           // Just can't use if put into play
//           if (effect.trainerCard.putIntoPlay) {
//             MOVE_CARD_TO(state, effect.trainerCard, player.discard);
//             REMOVE_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard, this);
//             return state;
//           }
//           // If tails, opponent can use the Trainer card if they want
//           CONFIRMATION_PROMPT(store, state, opponent, result => {
//             if (result) {
//               const playTrainerEffect = new TrainerEffect(opponent, effect.trainerCard);
//               store.reduceEffect(state, playTrainerEffect);
//             }
//             // After opponent's choice, remove marker and discard
//             REMOVE_MARKER(this.CHAOS_GYM_MARKER, effect.trainerCard, this);
//             MOVE_CARD_TO(state, effect.trainerCard, player.discard);
//           }, GameMessage.WANT_TO_USE_ABILITY);
//         }
//       });
//     }
//     return state;
//   }
// }
