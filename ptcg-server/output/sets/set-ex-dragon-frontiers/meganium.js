"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meganium = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Meganium extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Bayleef';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Evolutionary Call',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Meganium from your hand to evolve 1 of your Pokémon, you may search your deck for up to 3 in any combination of Basic Pokémon or Evolution cards. Show them to your opponent and put them into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Delta Reduction',
                cost: [F, C],
                damage: 40,
                text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
            },
            {
                name: 'Mega Impact',
                cost: [F, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'DF';
        this.name = 'Meganium';
        this.fullName = 'Meganium DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.DELTA_REDUCTION_MARKER = 'DELTA_REDUCTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 3, allowCancel: true });
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.DELTA_REDUCTION_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        // Reduce damage by 40
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.DELTA_REDUCTION_MARKER, this)) {
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 30;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DELTA_REDUCTION_MARKER, this);
        }
        return state;
    }
}
exports.Meganium = Meganium;
