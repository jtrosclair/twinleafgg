"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const effect_of_attack_effects_1 = require("../../game/store/effects/effect-of-attack-effects");
class Galvantula extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Leech Life',
                cost: [L],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Electroweb',
                cost: [L, C, C],
                damage: 60,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula BLW';
    }
    reduceEffect(store, state, effect) {
        // Leech Life - heal same amount as damage dealt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const healEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healEffect.target = effect.player.active;
            store.reduceEffect(state, healEffect);
        }
        // Electroweb - prevent retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const preventRetreat = new effect_of_attack_effects_1.PreventRetreatEffect(effect);
            preventRetreat.markerSource = this;
            preventRetreat.applyEffect();
        }
        return state;
    }
}
exports.Galvantula = Galvantula;
