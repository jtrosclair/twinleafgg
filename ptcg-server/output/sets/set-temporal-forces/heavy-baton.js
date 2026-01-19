"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyBaton = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HeavyBaton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TEF';
        this.name = 'Heavy Baton';
        this.fullName = 'Heavy Baton PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.text = 'If the Pokémon this card is attached to has a Retreat Cost of 4 or higher, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';
        this.HEAVY_BATON_MARKER = 'HEAVY_BATON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = effect.target;
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            if (active.marker.hasMarker(this.HEAVY_BATON_MARKER)) {
                return state;
            }
            // Check if this tool is attached to the active Pokemon
            if (!active.tools.includes(this)) {
                return state;
            }
            // Check if the Pokemon has a retreat cost of 4 or higher
            const pokemonCard = active.getPokemonCard();
            if (!pokemonCard || pokemonCard.retreat.length < 4) {
                return state;
            }
            // Get all basic energy cards from the active Pokemon
            const basicEnergyCards = active.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergyCards.length === 0) {
                return state;
            }
            // Add marker, do not invoke this effect for other wishful batons
            active.marker.addMarker(this.HEAVY_BATON_MARKER, this);
            // Make copy of the basic energy cards, because they will be transferred to discard shortly
            const energyToAttach = new game_1.CardList();
            energyToAttach.cards = basicEnergyCards.slice();
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, energyToAttach, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3, sameTarget: true }), transfers => {
                transfers = transfers || [];
                active.marker.removeMarker(this.HEAVY_BATON_MARKER);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card] });
                }
            });
        }
        return state;
    }
}
exports.HeavyBaton = HeavyBaton;
