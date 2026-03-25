"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BronzongBREAK = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BronzongBREAK extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BREAK];
        this.evolvesFrom = 'Bronzong';
        this.cardType = M;
        this.hp = 130;
        this.powers = [{
                name: 'BREAK Evolution Rule',
                powerType: game_1.PowerType.BREAK_RULE,
                text: 'Bronzong BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
            }];
        this.attacks = [{
                name: 'Metal Rain',
                cost: [M, C],
                damage: 0,
                text: 'Discard as many [M] Energy attached to this Pokémon as you like. For each Energy card discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. Don\'t apply Weakness and Resistance. (You may choose the same Pokémon more than once.)'
            }];
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Bronzong BREAK';
        this.fullName = 'Bronzong BREAK FCO';
    }
    reduceEffect(store, state, effect) {
        // Life Stream
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            const cardEnergyCounts = new Map(); // Map card objects to their energy counts
            // Check energy provided by each card
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            player.active.cards.forEach((card, index) => {
                const providedEnergy = checkProvidedEnergy.energyMap.filter(em => em.card === card);
                // Count how many Metal/Any energy are provided by this card
                let metalCount = 0;
                providedEnergy.forEach(em => {
                    em.provides.forEach(type => {
                        if (type === card_types_1.CardType.METAL || type === card_types_1.CardType.ANY) {
                            metalCount++;
                        }
                    });
                });
                // If the card doesn't provide any Lightning energy, block it
                if (metalCount === 0) {
                    blocked.push(index);
                }
                else {
                    cardEnergyCounts.set(card, metalCount);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, player.active, // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    // Save energy counts before discarding
                    let totalEnergy = 0;
                    cards.forEach(card => {
                        if (cardEnergyCounts.has(card)) {
                            totalEnergy += cardEnergyCounts.get(card) || 0;
                        }
                    });
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    const damage = totalEnergy * 30;
                    const maxAllowedDamage = [];
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                        maxAllowedDamage.push({ target, damage: card.hp + damage });
                    });
                    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 30 }), targets => {
                        const results = targets || [];
                        for (const result of results) {
                            const target = game_1.StateUtils.getTarget(state, player, result.target);
                            const putDamageEffect = new attack_effects_1.PutDamageEffect(effect, result.damage);
                            putDamageEffect.target = target;
                            store.reduceEffect(state, putDamageEffect);
                        }
                    });
                }
                return state;
            });
        }
        // slapping on the weakness, resistance, and retreat of the previous evolutions
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const cardList = effect.target;
            const previousPokemon = cardList.getPokemonCard();
            if (previousPokemon) {
                this.weakness = [...previousPokemon.weakness];
                this.resistance = [...previousPokemon.resistance];
                this.retreat = [...previousPokemon.retreat];
            }
        }
        // Trying to get all of the previous stage's attacks and powers
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                    player.showAllStageAbilities = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Add attacks from the previous stage to this one
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.attacks.push(...(evolutionCard.attacks || []));
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Adds the powers from the previous stage
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.BronzongBREAK = BronzongBREAK;
