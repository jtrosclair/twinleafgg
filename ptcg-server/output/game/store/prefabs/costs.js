"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = exports.DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON = exports.DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON = exports.DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON = void 0;
const __1 = require("../..");
const card_types_1 = require("../card/card-types");
const energy_card_1 = require("../card/energy-card");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
/**
 * These prefabs are for "costs" that effects/attacks must pay.
 */
function cardMatchesEnergyFilter(card, filter) {
    if (!(card instanceof energy_card_1.EnergyCard)) {
        return false;
    }
    for (const key in filter) {
        if (card[key] !== filter[key]) {
            return false;
        }
    }
    return true;
}
function energyCardProvidesType(card, cardType) {
    if (!(card instanceof energy_card_1.EnergyCard)) {
        return false;
    }
    return card.provides.includes(cardType) || card.provides.includes(card_types_1.CardType.ANY);
}
function discardTransfersAsEffects(store, state, effect, transfers) {
    const player = effect.player;
    const grouped = new Map();
    transfers.forEach(transfer => {
        const source = __1.StateUtils.getTarget(state, player, transfer.from);
        const cards = grouped.get(source) || [];
        cards.push(transfer.card);
        grouped.set(source, cards);
    });
    grouped.forEach((cards, source) => {
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = source;
        state = store.reduceEffect(state, discardEnergy);
    });
    return state;
}
/**
 * Discard up to X Energy cards from this Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
function DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, maxAmount, filter = {}, minAmount = 0, onDiscarded) {
    return DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store, state, effect, maxAmount, filter, minAmount, [__1.SlotType.ACTIVE], onDiscarded);
}
exports.DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON = DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON;
/**
 * Discard up to X Energy cards from your Pokémon.
 *
 * Defaults:
 * - `minAmount`: 0 (fully optional)
 * - `filter`: all Energy cards
 * - `slots`: Active + Bench
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
function DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store, state, effect, maxAmount, filter = {}, minAmount = 0, slots = [__1.SlotType.ACTIVE, __1.SlotType.BENCH], onDiscarded) {
    const player = effect.player;
    if (maxAmount <= 0) {
        return state;
    }
    let availableEnergy = 0;
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
        const slotType = cardList === player.active ? __1.SlotType.ACTIVE : __1.SlotType.BENCH;
        if (!slots.includes(slotType)) {
            return;
        }
        availableEnergy += cardList.cards.filter(card => cardMatchesEnergyFilter(card, filter)).length;
    });
    if (availableEnergy === 0) {
        return state;
    }
    const promptMax = Math.min(maxAmount, availableEnergy);
    const promptMin = Math.min(Math.max(0, minAmount), promptMax);
    return store.prompt(state, new __1.DiscardEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, __1.PlayerType.BOTTOM_PLAYER, slots, Object.assign({ superType: card_types_1.SuperType.ENERGY }, filter), { allowCancel: false, min: promptMin, max: promptMax }), transfers => {
        if (transfers === null || transfers.length === 0) {
            return state;
        }
        state = discardTransfersAsEffects(store, state, effect, transfers);
        if (onDiscarded !== undefined) {
            onDiscarded(transfers);
        }
        return state;
    });
}
exports.DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON = DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON;
/**
 * Discard up to X [type] Energy from your Pokémon.
 *
 * This defaults to all attached Energy and validates type server-side so callers
 * can safely use broad selection filters.
 *
 * Optional `onDiscarded` receives the resolved transfers after discard effects are applied.
 */
function DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(store, state, effect, maxAmount, cardType, minAmount = 0, slots = [__1.SlotType.ACTIVE, __1.SlotType.BENCH], onDiscarded) {
    const player = effect.player;
    if (maxAmount <= 0) {
        return state;
    }
    let availableTypedEnergy = 0;
    const blockedMap = [];
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
        if (!slots.includes(target.slot)) {
            return;
        }
        const blocked = [];
        cardList.cards.forEach((card, index) => {
            const isTypedEnergy = energyCardProvidesType(card, cardType);
            if (!isTypedEnergy) {
                blocked.push(index);
            }
            else {
                availableTypedEnergy += 1;
            }
        });
        blockedMap.push({ source: target, blocked });
    });
    if (availableTypedEnergy === 0) {
        return state;
    }
    const promptMax = Math.min(maxAmount, availableTypedEnergy);
    const promptMin = Math.min(Math.max(0, minAmount), promptMax);
    return store.prompt(state, new __1.DiscardEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, __1.PlayerType.BOTTOM_PLAYER, slots, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: promptMin, max: promptMax, blockedMap }), transfers => {
        if (transfers === null || transfers.length === 0) {
            return state;
        }
        if (!transfers.every(transfer => energyCardProvidesType(transfer.card, cardType))) {
            throw new __1.GameError(__1.GameMessage.INVALID_PROMPT_RESULT);
        }
        state = discardTransfersAsEffects(store, state, effect, transfers);
        if (onDiscarded !== undefined) {
            onDiscarded(transfers);
        }
        return state;
    });
}
exports.DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON = DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON;
/**
 * Discards an exact amount of Energy from this Pokémon.
 *
 * This helper is preserved for compatibility with existing exact-cost logic.
 */
function DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, amount, type = card_types_1.CardType.COLORLESS) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const energyList = [];
    for (let i = 0; i < amount; i++) {
        energyList.push(type);
    }
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        return store.reduceEffect(state, discardEnergy);
    });
    return state;
}
exports.DISCARD_X_ENERGY_FROM_THIS_POKEMON = DISCARD_X_ENERGY_FROM_THIS_POKEMON;
