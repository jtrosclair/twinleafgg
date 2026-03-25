"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND = exports.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED = exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON = exports.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE = exports.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS = exports.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS = exports.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS = exports.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE = exports.PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND = exports.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK = exports.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE = exports.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON = exports.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON = exports.PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND = exports.KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND = exports.DISCARD_A_STADIUM_CARD_IN_PLAY = void 0;
const __1 = require("../..");
const card_types_1 = require("../card/card-types");
const pokemon_card_1 = require("../card/pokemon-card");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const prefabs_1 = require("./prefabs");
const play_card_effects_1 = require("../effects/play-card-effects");
/**
 * These prefabs are for general attack effects.
 */
function DISCARD_A_STADIUM_CARD_IN_PLAY(state) {
    const stadiumCard = __1.StateUtils.getStadiumCard(state);
    if (stadiumCard !== undefined) {
        const cardList = __1.StateUtils.findCardList(state, stadiumCard);
        const player = __1.StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
    }
}
exports.DISCARD_A_STADIUM_CARD_IN_PLAY = DISCARD_A_STADIUM_CARD_IN_PLAY;
function DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(x, effect, state) {
    const player = effect.player;
    const cardsToDraw = x - player.hand.cards.length;
    if (cardsToDraw <= 0) {
        return state;
    }
    player.deck.moveTo(player.hand, cardsToDraw);
}
exports.DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND = DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND;
function HEAL_X_DAMAGE_FROM_THIS_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, damage);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
}
exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = HEAL_X_DAMAGE_FROM_THIS_POKEMON;
function KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(store, state, effect) {
    const knockOutEffect = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
    knockOutEffect.target = effect.opponent.active;
    return store.reduceEffect(state, knockOutEffect);
}
exports.KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON = KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON;
function PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(x, filterFn = () => true, store, state, effect) {
    const player = effect.player;
    const cardCount = player.discard.cards.filter(filterFn).length;
    if (cardCount === 0) {
        return state;
    }
    const max = Math.min(x, cardCount);
    const min = max;
    return store.prompt(state, [
        new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_HAND, 
        // TODO: Make this work for more than just Items!
        player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min, max, allowCancel: false })
    ], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
    });
}
exports.PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND = PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND;
function PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(x, store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const activeDamageEffect = new attack_effects_1.PutCountersEffect(effect, 10 * x);
    activeDamageEffect.target = opponent.active;
    store.reduceEffect(state, activeDamageEffect);
    opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0) {
            const damageEffect = new attack_effects_1.PutCountersEffect(effect, 10 * x);
            damageEffect.target = bench;
            store.reduceEffect(state, damageEffect);
        }
    });
}
exports.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON = PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON;
function PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(x, store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const putCounters = new attack_effects_1.PutCountersEffect(effect, 10 * x);
    putCounters.target = opponent.active;
    return store.reduceEffect(state, putCounters);
}
exports.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON = PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON;
function PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(x, store, state, effect, slotTypes = [__1.SlotType.ACTIVE, __1.SlotType.BENCH]) {
    const player = effect.player;
    const opponent = effect.opponent;
    const hasBenched = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBenched && !slotTypes.includes(__1.SlotType.ACTIVE)) {
        return state;
    }
    const maxAllowedDamage = [];
    opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: 9999 });
    });
    return store.prompt(state, new __1.PutDamagePrompt(effect.player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, slotTypes, 10 * x, maxAllowedDamage, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = __1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
        }
    });
}
exports.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE = PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE;
function SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect) {
    const player = effect.player;
    // Get all Pokemon cards (including evolutions)
    const pokemons = player.active.getPokemons();
    // Get other attached cards (energy, etc.) but not Pokemon or tools
    const otherCards = player.active.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
        !pokemons.includes(card) &&
        (!player.active.tools || !player.active.tools.includes(card)));
    // Get tools separately
    const tools = [...player.active.tools];
    // Clear effects from the Pokemon
    player.active.clearEffects();
    // Move other cards (energy) to deck
    if (otherCards.length > 0) {
        (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.deck, { cards: otherCards });
    }
    // Move tools to deck explicitly
    for (const tool of tools) {
        player.active.moveCardTo(tool, player.deck);
    }
    // Move Pokemon cards to deck
    if (pokemons.length > 0) {
        (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.deck, { cards: pokemons });
    }
    return store.prompt(state, new __1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
exports.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK = SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK;
function PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND(store, state, effect) {
    const player = effect.player;
    // Get all Pokemon cards (including evolutions)
    const pokemons = player.active.getPokemons();
    // Get other attached cards (energy, etc.) but not Pokemon or tools
    const otherCards = player.active.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
        !pokemons.includes(card) &&
        (!player.active.tools || !player.active.tools.includes(card)));
    // Get tools separately
    const tools = [...player.active.tools];
    // Clear effects from the Pokemon
    player.active.clearEffects();
    // Move other cards (energy) to deck
    if (otherCards.length > 0) {
        (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: otherCards });
    }
    // Move tools to deck explicitly
    for (const tool of tools) {
        player.active.moveCardTo(tool, player.hand);
    }
    // Move Pokemon cards to deck
    if (pokemons.length > 0) {
        (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.hand, { cards: pokemons });
    }
}
exports.PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND = PUT_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_HAND;
function FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, amount) {
    const coinFlip = new play_card_effects_1.CoinFlipEffect(effect.player, (result) => {
        if (result) {
            effect.damage += amount;
        }
    });
    return store.reduceEffect(state, coinFlip);
}
exports.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE = FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE;
function FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads) {
    return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, heads => {
        effect.damage = damagePerHeads * heads;
    });
}
exports.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS = FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS;
function FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads) {
    return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, heads => {
        effect.damage += damagePerHeads * heads;
    });
}
exports.FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS = FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS;
function THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, amount) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, effect.damage);
    store.reduceEffect(state, applyWeakness);
    const damage = applyWeakness.damage;
    effect.damage = 0;
    if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
    }
}
exports.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS = THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS;
function THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(damage, filterFn = () => true, effect) {
    const player = effect.player;
    let pokemonCount = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof pokemon_card_1.PokemonCard && filterFn(c)) {
            pokemonCount += 1;
        }
    });
    effect.damage = pokemonCount * damage;
}
exports.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE = THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE;
function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.getPokemonInPlay();
    if (targets.length === 0)
        return state;
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH, __1.SlotType.ACTIVE]), selected => {
        const target = selected[0];
        let damageEffect;
        if (target === opponent.active) {
            damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
        }
        else {
            damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        }
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON;
function THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.bench.filter(b => b.cards.length > 0);
    if (targets.length === 0) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH]), selected => {
        const target = selected[0];
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect) {
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect) {
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect) {
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect) {
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED;
function YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect) {
    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
    store.reduceEffect(state, specialConditionEffect);
}
exports.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED = YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED;
function DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
    if (energyCards.length === 0) {
        return state;
    }
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = opponent.active;
            store.reduceEffect(state, discardEnergy);
        }
    });
}
exports.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON = DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON;
/**
 * You may put up to X Energy attached to your opponent's Active Pokémon into their hand.
 * Uses CardsToHandEffect (AbstractAttackEffect) so abilities like Charmeleon's Flare Veil can block it.
 */
function PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND(store, state, effect, options) {
    var _a;
    const count = (_a = options === null || options === void 0 ? void 0 : options.count) !== null && _a !== void 0 ? _a : 1;
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
    state = store.reduceEffect(state, checkEnergy);
    if (checkEnergy.energyMap.length === 0) {
        return state;
    }
    const cost = Array(count).fill(card_types_1.CardType.COLORLESS);
    return store.prompt(state, new __1.ConfirmPrompt(player.id, __1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
        if (wantToUse) {
            const selectCount = Math.min(count, checkEnergy.energyMap.length);
            store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_HAND, checkEnergy.energyMap, cost.slice(0, selectCount), { allowCancel: false }), energy => {
                const cards = (energy || []).slice(0, selectCount).map(e => e.card);
                if (cards.length > 0) {
                    const toHandEffect = new attack_effects_1.CardsToHandEffect(effect, cards);
                    toHandEffect.target = opponent.active;
                    store.reduceEffect(state, toHandEffect);
                }
            });
        }
    });
}
exports.PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND = PUT_ENERGY_FROM_OPPONENTS_ACTIVE_INTO_THEIR_HAND;
