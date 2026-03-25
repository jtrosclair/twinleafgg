"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Confuse Ray',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Swift',
                cost: [W],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on the Defending Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Starmie';
        this.fullName = 'Starmie NXD';
    }
    reduceEffect(store, state, effect) {
        // Confuse Ray
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Swift - damage isn't affected by Weakness, Resistance, or effects
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Apply 50 damage directly, bypassing weakness/resistance/effects
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 50);
            store.reduceEffect(state, applyWeakness);
            // Set effect.damage to 0 so normal damage calculation is skipped
            effect.damage = 0;
            // Directly add damage
            opponent.active.damage += 50;
            const afterDamage = new attack_effects_1.AfterDamageEffect(effect, 50);
            state = store.reduceEffect(state, afterDamage);
        }
        return state;
    }
}
exports.Starmie = Starmie;
