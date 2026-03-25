"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virizion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
class Virizion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Giga Drain',
                cost: [G, C],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
            },
            {
                name: 'Sacred Sword',
                cost: [G, G, C],
                damage: 100,
                text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Virizion';
        this.fullName = 'Virizion EPO';
        this.SACRED_SWORD_MARKER = 'SACRED_SWORD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // We need to heal after damage is dealt
            const afterDamage = new attack_effects_2.AfterDamageEffect(effect, effect.damage);
            state = store.reduceEffect(state, afterDamage);
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect.damage, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.marker.hasMarker(this.SACRED_SWORD_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.active.marker.addMarker(this.SACRED_SWORD_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.removeMarker(this.SACRED_SWORD_MARKER, this);
        }
        return state;
    }
}
exports.Virizion = Virizion;
