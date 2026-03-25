"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gigalith = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gigalith extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Boldore';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Power Gem',
                cost: [F, C, C],
                damage: 60,
                text: 'Does 10 damage to each of your opponent\'s Benched Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gigalith';
        this.fullName = 'Gigalith NVI';
    }
    reduceEffect(store, state, effect) {
        // Power Gem - 60 damage + bench spread based on energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count energy attached to this Pokémon
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let energyCount = 0;
            checkEnergy.energyMap.forEach(em => {
                energyCount += 1;
            });
            // Damage each benched Pokémon for 10 x energy count
            const benchDamage = 10 * energyCount;
            if (benchDamage > 0) {
                opponent.bench.forEach(benchSlot => {
                    if (benchSlot.cards.length > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, benchDamage);
                        damageEffect.target = benchSlot;
                        store.reduceEffect(state, damageEffect);
                    }
                });
            }
        }
        return state;
    }
}
exports.Gigalith = Gigalith;
