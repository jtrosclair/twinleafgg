"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlakazamStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlakazamStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psychic Select',
                cost: [P],
                damage: 0,
                text: 'Put any 1 card from your discard pile into your hand.'
            },
            {
                name: 'Skill Copy',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard a Basic Pokémon or Evolution card from your hand. Choose 1 of that card\'s attacks. Skill Copy copies this attack. This attack does nothing if Alakazam Star doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Alakazam Star performs that attack.'
            },
        ];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Alakazam Star';
        this.fullName = 'Alakazam Star CG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 1, max: 1, allowCancel: false }, this.attacks[0]);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
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
                    // Discard the card from hand that the attack came from
                    const cardToDiscard = pokemonCards.find(card => card.attacks.some(a => a === attack));
                    if (cardToDiscard) {
                        player.hand.moveCardTo(cardToDiscard, player.discard);
                    }
                }
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
        player.hand.cards.forEach(card => {
            if (card instanceof pokemon_card_1.PokemonCard) {
                this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
            }
        });
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
exports.AlakazamStar = AlakazamStar;
