"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quagsire = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Quagsire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wooper';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Laid-Back',
                powerType: game_1.PowerType.ABILITY,
                text: 'Any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Mud Gun',
                cost: [W, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon has any [F] Energy attached to it, this attack does 30 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quagsire';
        this.fullName = 'Quagsire PLF';
    }
    reduceEffect(store, state, effect) {
        // Ability: Laid-Back (passive - damage reduction)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            // Check ability lock
            try {
                const stub = new game_effects_1.PowerEffect(targetOwner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.damage = Math.max(0, effect.damage - 20);
        }
        // Attack: Mud Gun
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if this Pokemon has any [F] Energy attached
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkEnergy);
            const hasFightingEnergy = checkEnergy.energyMap.some(em => em.provides.includes(card_types_1.CardType.FIGHTING));
            if (hasFightingEnergy) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Quagsire = Quagsire;
