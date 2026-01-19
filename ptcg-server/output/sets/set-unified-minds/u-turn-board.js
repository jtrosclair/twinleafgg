"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTurnBoard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class UTurnBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNM';
        this.name = 'U-Turn Board';
        this.fullName = 'U-Turn Board UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '211';
        this.U_TURN_BOARD_MARKER = 'U_TURN_BOARD_MARKER';
        this.text = `The Retreat Cost of the Pokémon this card is attached to is [C] less. 
    
    If this card is discarded from play, put it into your hand instead of the discard pile.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.cards.includes(this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            const cardsToMove = effect.cards.filter(c => c === this);
            if (cardsToMove.length > 0) {
                state = (0, prefabs_1.MOVE_CARDS)(store, state, effect.target, player.hand, { cards: cardsToMove });
                effect.cards = effect.cards.filter(c => c !== this);
            }
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tools.includes(this)) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (index !== -1) {
                effect.cost.splice(index, 1);
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect && state.players.some(p => p.discard.cards.includes(this))) {
            for (const player of state.players) {
                if (!player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
                    continue;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.U_TURN_BOARD_MARKER && m.source !== undefined)
                    .map(m => m.source);
                const cardsInDiscard = rescued.filter(c => player.discard.cards.includes(c));
                if (cardsInDiscard.length > 0) {
                    state = (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: cardsInDiscard });
                    player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
                }
            }
        }
        return state;
    }
}
exports.UTurnBoard = UTurnBoard;
// if (effect instanceof ToolEffect && effect.player.active.tools.includes(this)) {
//   const player = effect.player;
//   player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
// }
//     if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
//       const player = effect.player;
//       // Do not activate between turns, or when it's not opponents turn.
//       if (state.phase !== GamePhase.ATTACK) {
//         return state;
//       }
//       const target = effect.target;
//       const cards = target.cards;
//       cards.forEach(card => {
//         player.marker.addMarker(this.U_TURN_BOARD_MARKER, this);
//       });
//     }
//     if (effect instanceof BetweenTurnsEffect) {
//       state.players.forEach(player => {
//         if (!player.marker.hasMarker(this.U_TURN_BOARD_MARKER, this)) {
//           return;
//         }
//         try {
//           const toolEffect = new ToolEffect(player, this);
//           store.reduceEffect(state, toolEffect);
//         } catch {
//           return state;
//         }
//         const rescued: Card[] = player.marker.markers
//           .filter(m => m.name === this.U_TURN_BOARD_MARKER && m.source !== undefined)
//           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//           .map(m => m.source!); // Add non-null assertion operator
//         player.discard.moveCardsTo(rescued, player.hand);
//         player.marker.removeMarker(this.U_TURN_BOARD_MARKER, this);
//       });
//     }
//     return state;
// }
