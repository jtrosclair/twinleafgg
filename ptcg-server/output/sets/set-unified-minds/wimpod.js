"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wimpod = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Wimpod extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sand Attack',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack doesn\'t happen.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Wimpod';
        this.fullName = 'Wimpod UNM';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
        this.SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.SMOKESCREEN_MARKER, opponent, this)) {
                return state; // Avoids recursion
            }
            effect.preventDefault = true;
            (0, prefabs_1.ADD_MARKER)(this.SMOKESCREEN_MARKER, opponent, this); // Avoids recursion
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, effect.attack);
                    store.reduceEffect(state, useAttackEffect);
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SMOKESCREEN_MARKER, this);
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.Wimpod = Wimpod;
