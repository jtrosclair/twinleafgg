"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Copy',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of the Defending Pokémon\'s attacks.Copy copies that attack.This attack does nothing if Sudowoodo doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Sudowoodo performs that attack.'
            },
            {
                name: 'Karate Chop',
                cost: [F, C, C],
                damage: 50,
                damageCalculation: '-',
                text: 'Does 50 damage minus 10 damage for each damage counter on Sudowoodo.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo UF';
    }
    reduceEffect(store, state, effect) {
        // Copy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Build cards and blocked for Choose Attack prompt
            const { pokemonCards, blocked } = this.buildAttackList(state, store, player);
            // No attacks to copy
            if (pokemonCards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel: true, blocked }), attack => {
                if (attack !== null) {
                    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
                    store.reduceEffect(state, attackEffect);
                    if (attackEffect.damage > 0) {
                        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                        state = store.reduceEffect(state, dealDamage);
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = Math.max(50 - effect.source.damage, 0);
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const opponent = game_1.StateUtils.getOpponent(state, player);
        const opponentActive = opponent.active.getPokemonCard();
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        if (opponentActive) {
            this.checkAttack(state, store, player, opponentActive, energyMap, pokemonCards, blocked);
        }
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        {
            const attacks = card.attacks.filter(attack => {
                const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
                state = store.reduceEffect(state, checkAttackCost);
                return game_1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
            });
            const index = pokemonCards.length;
            pokemonCards.push(card);
            card.attacks.forEach(attack => {
                if (!attacks.includes(attack)) {
                    blocked.push({ index, attack: attack.name });
                }
            });
        }
    }
}
exports.Sudowoodo = Sudowoodo;
