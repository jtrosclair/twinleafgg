"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slakoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slakoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.LAZY_HOWL_MARKER = 'SLAKOTH_UNM_LAZY_HOWL_MARKER';
        this.CLEAR_LAZY_HOWL_MARKER = 'SLAKOTH_UNM_CLEAR_LAZY_HOWL_MARKER';
        this.attacks = [
            {
                name: 'Lazy Howl',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, if they attach an Energy card from their hand to the Defending Pokémon, their turn ends.'
            },
            {
                name: 'Hang Down',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '167';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slakoth';
        this.fullName = 'Slakoth UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Lazy Howl
        // Ref: Custom implementation - intercept AttachEnergyEffect and end opponent's turn via EndTurnEffect
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.LAZY_HOWL_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_LAZY_HOWL_MARKER, this);
        }
        // Intercept energy attachment to the marked Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect
            && effect.target.marker.hasMarker(this.LAZY_HOWL_MARKER, this)) {
            // If energy is being attached from hand, end the opponent's turn
            const player = effect.player;
            if (player.hand.cards.includes(effect.energyCard)) {
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_LAZY_HOWL_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_LAZY_HOWL_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.active.marker.removeMarker(this.LAZY_HOWL_MARKER, this);
        }
        return state;
    }
}
exports.Slakoth = Slakoth;
