"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagearnaEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MagearnaEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Mystic Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of your opponent\'s attacks, except damage, done to each of your Pokémon that has any [M] Energy attached to it. (Existing effects are not removed.)'
            }];
        this.attacks = [{
                name: 'Soul Blaster',
                cost: [M, C, C],
                damage: 120,
                text: 'During your next turn, this Pokémon\'s Soul Blaster attack\'s base damage is 60.'
            }];
        this.set = 'STS';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magearna-EX';
        this.fullName = 'Magearna-EX STS';
        this.SOUL_BLASER_MARKER = 'SOUL_BLASER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            let hasMagearnaInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasMagearnaInPlay = true;
                }
            });
            if (!hasMagearnaInPlay) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasMetalEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.METAL]);
            if (hasMetalEnergy) {
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_MARKER)(this.SOUL_BLASER_MARKER, this, this);
            (0, prefabs_1.ADD_MARKER)(this.SOUL_BLASER_MARKER, effect.player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.SOUL_BLASER_MARKER, this, this)) {
                effect.damage = 60;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && (0, prefabs_1.HAS_MARKER)(this.SOUL_BLASER_MARKER, effect.player, this)) {
            (0, prefabs_1.REMOVE_MARKER)(this.SOUL_BLASER_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && !(0, prefabs_1.HAS_MARKER)(this.SOUL_BLASER_MARKER, effect.player, this)) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                (0, prefabs_1.REMOVE_MARKER)(this.SOUL_BLASER_MARKER, effect.player, card);
            });
        }
        return state;
    }
}
exports.MagearnaEX = MagearnaEX;
