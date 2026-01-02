"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dugtrio = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class Dugtrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Diglett';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Sand Veil',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
            }];
        this.attacks = [
            {
                name: 'Dig Under',
                cost: [F, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Double-edge',
                cost: [F, C, C],
                damage: 60,
                text: 'Dugtrio does 10 damage to itself.'
            },
        ];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Dugtrio';
        this.fullName = 'Dugtrio CG';
    }
    reduceEffect(store, state, effect) {
        // Dig Under
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
        }
        // Double-edge
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        // Sand Veil
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // Find the owner of the target (the defending player)
            const defendingPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            // Find the owner of the source (the attacking player)
            const attackingPlayer = state_utils_1.StateUtils.findOwner(state, effect.source);
            // Only prevent if the effect is coming from the opponent
            if (attackingPlayer === defendingPlayer) {
                return state;
            }
            // Only prevent if the target is on the bench (not active)
            if (effect.target === defendingPlayer.active) {
                return state;
            }
            // Check if Manaphy is in play on the defending player's field
            let isManaphyInPlay = false;
            defendingPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof Dugtrio) {
                    isManaphyInPlay = true;
                }
            });
            if (!isManaphyInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(defendingPlayer, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Dugtrio = Dugtrio;
