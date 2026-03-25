"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darkrai = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Darkrai extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: F, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Darkness Shade',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Darkrai from your hand onto your Bench, you may choose 1 of the Defending Pokémon. That Pokémon is now Asleep.'
            }];
        this.attacks = [{
                name: 'Dark Slumber',
                cost: [D],
                damage: 20,
                text: 'At the end of your opponent\'s next turn, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Dark Resolve',
                cost: [D, D, C],
                damage: 40,
                text: 'If the Defending Pokémon is Asleep, remove 4 damage counters from Darkrai.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Darkrai';
        this.fullName = 'Darkrai MD';
        this.PUT_SLEEP_MARKER = 'PUT_SLEEP_MARKER';
        this.CLEAR_PUT_SLEEP_MARKER = 'CLEAR_PUT_SLEEP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            // Apply Spiky Shell effect at the end of opponent's next turn
            effect.player.marker.addMarker(this.PUT_SLEEP_MARKER, this);
            opponent.active.marker.addMarker(this.CLEAR_PUT_SLEEP_MARKER, this);
        }
        // 30 damage to opponent's active if end turn and counters marker is present
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_PUT_SLEEP_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            effect.player.active.marker.removeMarker(this.CLEAR_PUT_SLEEP_MARKER, this);
            opponent.marker.removeMarker(this.PUT_SLEEP_MARKER, this);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PUT_SLEEP_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 40);
            }
        }
        return state;
    }
}
exports.Darkrai = Darkrai;
