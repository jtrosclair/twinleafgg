"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishfulBaton = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_list_1 = require("../../game/store/state/card-list");
class WishfulBaton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'BUS';
        this.name = 'Wishful Baton';
        this.fullName = 'Wishful Baton BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.text = 'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.';
        this.WISHFUL_BATON_MARKER = 'WISHFUL_BATON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const active = effect.target;
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            if (active.marker.hasMarker(this.WISHFUL_BATON_MARKER)) {
                return state;
            }
            // Check if this tool is attached to the active Pokemon
            if (!active.tools.includes(this)) {
                return state;
            }
            // Get all basic energy cards from the active Pokemon
            const basicEnergyCards = active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergyCards.length === 0) {
                return state;
            }
            // Add marker, do not invoke this effect for other wishful batons
            active.marker.addMarker(this.WISHFUL_BATON_MARKER, this);
            // Make copy of the basic energy cards, because they will be transferred to discard shortly
            const energyToAttach = new card_list_1.CardList();
            energyToAttach.cards = basicEnergyCards.slice();
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, energyToAttach, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3, sameTarget: true }), transfers => {
                transfers = transfers || [];
                active.marker.removeMarker(this.WISHFUL_BATON_MARKER);
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card] });
                }
            });
        }
        return state;
    }
}
exports.WishfulBaton = WishfulBaton;
