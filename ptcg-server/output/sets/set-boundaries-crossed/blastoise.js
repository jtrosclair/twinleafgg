"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blastoise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Deluge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may attach a [W] Energy card from your hand to 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Hydro Pump',
                cost: [C, C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [W] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'BCR';
        this.setNumber = '31';
        this.name = 'Blastoise';
        this.fullName = 'Blastoise BCR';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 10;
            return state;
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            /*
             * Legacy pre-prefab implementation:
             * - manually checked for basic Water Energy in hand
             * - opened AttachEnergyPrompt against hand -> Active/Bench
             * - resolved transfer targets with StateUtils.getTarget
             * - attached cards with AttachEnergyEffect
             */
            // Converted to prefab version (AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND).
            return (0, prefabs_1.AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND)(store, state, player, card_types_1.CardType.WATER);
        }
        return state;
    }
}
exports.Blastoise = Blastoise;
