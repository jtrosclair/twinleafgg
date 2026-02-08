"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aurorus = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const effect_of_attack_effects_1 = require("../../game/store/effects/effect-of-attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aurorus extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Amaura';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Tundra Wall',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'While this Pokemon is in play, all of your Pokemon that have a [W] Energy attached take 50 less damage from attacks from your opponent\'s Pokemon. This Ability does not stack.'
            }];
        this.attacks = [{
                name: 'Freezing Chill',
                cost: [W, W, C],
                damage: 150,
                text: 'During your opponent\'s next turn, the Defending Pokemon can\'t attack.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Aurorus';
        this.fullName = 'Aurorus M3';
        this.TUNDRA_WALL_MARKER = 'TUNDRA_WALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Reduce damage by 50 for Pokemon with [W] Energy
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            const sourceOwner = game_1.StateUtils.findOwner(state, effect.source);
            const opponent = game_1.StateUtils.getOpponent(state, targetOwner);
            // Only reduce damage from opponent's attacks
            if (sourceOwner !== opponent) {
                return state;
            }
            // Check if Aurorus is in play
            let isAurorusInPlay = false;
            targetOwner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAurorusInPlay = true;
                }
            });
            if (!isAurorusInPlay) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetOwner, this)) {
                return state;
            }
            // Check if target has [W] Energy (only reduce for Pokemon with [W] Energy)
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(targetOwner, effect.target);
            store.reduceEffect(state, checkEnergy);
            const hasWaterEnergy = checkEnergy.energyMap.some(em => em.provides.includes(game_1.CardType.WATER) || em.provides.includes(game_1.CardType.ANY));
            if (hasWaterEnergy) {
                effect.damage = Math.max(0, effect.damage - 50);
            }
        }
        // Attack: Prevent opponent from attacking next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const preventAttackEffect = new effect_of_attack_effects_1.PreventAttackEffect(effect);
            store.reduceEffect(state, preventAttackEffect);
        }
        return state;
    }
}
exports.Aurorus = Aurorus;
