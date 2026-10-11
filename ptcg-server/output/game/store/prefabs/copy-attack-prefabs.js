"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COPY_ATTACK_VIA_ABILITY = exports.buildAttackListWithEnergyBlocking = exports.findPokemonCardForAttack = void 0;
const __1 = require("../..");
const pokemon_card_1 = require("../card/pokemon-card");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const copy_attack_delegation_1 = require("./copy-attack-delegation");
function findPokemonCardForAttack(cards, attack) {
    const pokemonCards = cards.filter((card) => card instanceof pokemon_card_1.PokemonCard);
    // Preserve reference identity across all cards before falling back to legacy name matching.
    return pokemonCards.find(card => card.attacks.includes(attack))
        || pokemonCards.find(card => card.attacks.some(a => a.name === attack.name));
}
exports.findPokemonCardForAttack = findPokemonCardForAttack;
function isAttackLockedNextTurn(player, attack) {
    return (player.active.cannotUseAttacksNextTurn || []).includes(attack.name);
}
/**
 * Build attack prompt data with energy-cost blocking for ability-based copy effects.
 */
function buildAttackListWithEnergyBlocking(state, store, player, options = {}) {
    const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;
    const pokemonCards = [];
    const blocked = [];
    const addCardWithBlocking = (card) => {
        const affordableAttacks = card.attacks.filter(attack => {
            const checked = (0, copy_attack_delegation_1.checkCopiedAttackCost)(store, state, player, card, attack, options.copycatCard);
            state = checked.state;
            const checkAttackCost = checked.effect;
            return __1.StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
        });
        const index = pokemonCards.length;
        pokemonCards.push(card);
        const locked = new Set(player.active.cannotUseAttacksNextTurn || []);
        card.attacks.forEach(attack => {
            if (!affordableAttacks.includes(attack) || locked.has(attack.name)) {
                blocked.push({ index, attack: attack.name });
            }
        });
    };
    const scanInPlay = (scanPlayer) => {
        scanPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
            const card = cardList.getPokemonCard();
            if (card === undefined) {
                return;
            }
            if (options.filter && !options.filter(cardList, card)) {
                return;
            }
            addCardWithBlocking(card);
        });
    };
    scanInPlay(player);
    if (options.includeOpponent) {
        scanInPlay(__1.StateUtils.getOpponent(state, player));
    }
    if (options.extraCards) {
        for (const card of options.extraCards) {
            addCardWithBlocking(card);
        }
    }
    return { pokemonCards, blocked };
}
exports.buildAttackListWithEnergyBlocking = buildAttackListWithEnergyBlocking;
/**
 * Ability: choose an attack from in-play Pokémon (with energy blocking) and use it.
 * Runs through UseAttackEffect with delegateFrom so energy/status checks apply.
 */
function COPY_ATTACK_VIA_ABILITY(store, state, effect, options) {
    const player = effect.player;
    const { copycatCard, allowCancel = true, requireActiveCopycat = true } = options;
    if (requireActiveCopycat && player.active.getPokemonCard() !== copycatCard) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    const { pokemonCards, blocked } = buildAttackListWithEnergyBlocking(state, store, player, options);
    if (pokemonCards.length === 0) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    return store.prompt(state, new __1.ChooseAttackPrompt(player.id, __1.GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, { allowCancel, blocked }), attack => {
        if (attack === null) {
            return state;
        }
        if (isAttackLockedNextTurn(player, attack)) {
            return state;
        }
        const sourceCard = findPokemonCardForAttack(pokemonCards, attack);
        if (sourceCard === undefined) {
            return state;
        }
        const useAttackEffect = new game_effects_1.UseAttackEffect(player, attack);
        useAttackEffect.delegateFrom = sourceCard;
        useAttackEffect.source = player.active;
        return store.reduceEffect(state, useAttackEffect);
    });
}
exports.COPY_ATTACK_VIA_ABILITY = COPY_ATTACK_VIA_ABILITY;
