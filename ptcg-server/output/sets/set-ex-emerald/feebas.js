"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feebas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feebas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Submerge',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Feebas is on your Bench, prevent all damage done to Feebas by attacks (both yours and your opponent\'s).'
            }];
        this.attacks = [{
                name: 'Lunge',
                cost: [W, C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'EM';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Feebas';
        this.fullName = 'Feebas EM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Target is this Feebas
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.POKEBODY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_b) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Feebas = Feebas;
