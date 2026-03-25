"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Espeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Solar Revelation',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of your opponent\'s attacks, except damage, done to each of your Pokémon that has any Energy attached to it.'
            }];
        this.attacks = [{
                name: 'Psy Report',
                cost: [P, C, C],
                damage: 60,
                text: 'Your opponent reveals his or her hand.'
            }];
        this.set = 'DEX';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Espeon';
        this.fullName = 'Espeon DEX';
    }
    reduceEffect(store, state, effect) {
        // Solar Revelation - prevent effects (except damage) on Pokémon with energy
        if (effect instanceof attack_effects_1.AbstractAttackEffect) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            const sourcePlayer = effect.player;
            // Ability only works on opponent's attacks
            if (targetPlayer === sourcePlayer) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            // Check if Espeon is in play
            let hasEspeonInPlay = false;
            targetPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasEspeonInPlay = true;
                }
            });
            if (!hasEspeonInPlay) {
                return state;
            }
            // Check if the target Pokémon has any energy attached
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(targetPlayer, effect.target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const hasEnergy = checkProvidedEnergyEffect.energyMap.length > 0;
            if (hasEnergy) {
                // Allow Weakness & Resistance effects
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage effects
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                // Block all other attack effects
                effect.preventDefault = true;
            }
        }
        // Psy Report - opponent reveals hand
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponent.hand.cards), () => { });
        }
        return state;
    }
}
exports.Espeon = Espeon;
