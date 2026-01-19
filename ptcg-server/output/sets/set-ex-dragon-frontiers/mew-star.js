"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MewStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.STAR, card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mimicry',
                cost: [C],
                damage: 0,
                text: 'Choose an attack on 1 of your opponent\'s Pokémon in play. Mimicry copies that attack. This attack does nothing if Mew Star doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Mew Star performs that attack.'
            },
            {
                name: 'Rainbow Wave',
                cost: [W],
                damage: 0,
                text: 'Choose 1 basic Energy card attached to Mew Star. This attack does 20 damage to each of your opponent\'s Pokémon that is the same type as the basic Energy card that you chose. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DF';
        this.name = 'Mew Star';
        this.fullName = 'Mew Star DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
    }
    reduceEffect(store, state, effect) {
        // Mimicry
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
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
        //Rainbow Wave
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (!player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC)) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGY_TYPE, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return state;
                }
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, target => {
                    const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(target);
                    store.reduceEffect(state, checkPokemonTypeEffect);
                    if (cards[0].provides &&
                        checkPokemonTypeEffect.cardTypes.includes(cards[0].provides[0])) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    }
                });
                return state;
            });
        }
        return state;
    }
    buildAttackList(state, store, player) {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyMap = checkProvidedEnergyEffect.energyMap;
        const pokemonCards = [];
        const blocked = [];
        // Check opponent's Pokemon
        const opponent = game_1.StateUtils.getOpponent(state, player);
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
            this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
        });
        return { pokemonCards, blocked };
    }
    checkAttack(state, store, player, card, energyMap, pokemonCards, blocked) {
        // No need to include Mew ex to the list
        if (card instanceof MewStar) {
            return;
        }
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
exports.MewStar = MewStar;
