"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloyster = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cloyster extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelder';
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Solid Shell',
                powerType: __1.PowerType.POKEBODY,
                text: 'Prevent all effects of attacks, including damage, done by your opponent\'s Pokémon to each of your Benched Pokémon that has delta on its card.'
            }];
        this.attacks = [{
                name: 'Grind',
                cost: [F],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each Energy attached to Cloyster.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Cloyster';
        this.fullName = 'Cloyster DF';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            const damagePerEnergy = 10;
            effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect) || (effect instanceof attack_effects_1.PutCountersEffect)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active || !((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DELTA_SPECIES))) {
                return state;
            }
            const targetPlayer = __1.StateUtils.findOwner(state, effect.target);
            let isCloysterInPlay = false;
            targetPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isCloysterInPlay = true;
                }
            });
            if (!isCloysterInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Cloyster = Cloyster;
