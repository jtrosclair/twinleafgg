"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rabsca = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rabsca extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rellor';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Spherical Shield',
                powerType: __1.PowerType.ABILITY,
                text: 'Prevent all damage from and effects of attacks done to your Benched Pokémon by attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Psychic',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Rabsca';
        this.fullName = 'Rabsca TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 30;
        }
        /*
         * Legacy pre-prefab implementation:
         * - manually intercepted PutDamageEffect / PutCountersEffect
         * - manually checked bench-only targeting and Rabsca-in-play ownership
         * - manually stubbed PowerEffect for ability lock handling
         * - prevented by setting effect.preventDefault = true
         */
        // Converted to prefab version:
        // - PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS
        // - PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS
        state.players.forEach(owner => {
            (0, prefabs_1.PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS)(store, state, effect, {
                owner,
                source: this,
                includeSourcePokemon: true
            });
            (0, prefabs_1.PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS)(store, state, effect, {
                owner,
                source: this,
                includeSourcePokemon: true
            });
        });
        return state;
    }
}
exports.Rabsca = Rabsca;
