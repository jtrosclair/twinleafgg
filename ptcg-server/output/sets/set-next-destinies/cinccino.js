"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cinccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Minccino';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Smooth Coat',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
            }];
        this.attacks = [{
                name: 'Echoed Voice',
                cost: [C, C, C],
                damage: 50,
                text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
            }];
        this.set = 'NXD';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cinccino';
        this.fullName = 'Cinccino NXD';
        this.ECHOED_VOICE_MARKER = 'ECHOED_VOICE_MARKER';
        this.ECHOED_VOICE_CLEAR_MARKER = 'ECHOED_VOICE_CLEAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Smooth Coat - flip coin to prevent damage
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (effect.damage <= 0) {
                return state;
            }
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage = 0;
                }
            });
        }
        // Echoed Voice
        // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
        (0, prefabs_1.NEXT_TURN_ATTACK_BONUS)(effect, {
            attack: this.attacks[0],
            source: this,
            bonusDamage: 50,
            bonusMarker: this.ECHOED_VOICE_MARKER,
            clearMarker: this.ECHOED_VOICE_CLEAR_MARKER
        });
        return state;
    }
}
exports.Cinccino = Cinccino;
