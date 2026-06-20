"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPPONENT_HAS_USED_VSTAR_POWER = exports.PLAYER_HAS_USED_VSTAR_POWER = exports.BLOCK_IF_VSTAR_POWER_USED = exports.THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED = exports.COUNT_MATCHING_CARDS_IN_ZONE = exports.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK = exports.ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON = exports.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON = exports.AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND = exports.DISCARD_ALL_ENERGY_FROM_POKEMON = exports.PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND = exports.DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON = exports.DISCARD_X_ENERGY_FROM_YOUR_HAND = exports.ATTACH_ENERGY_PROMPT = exports.DAMAGE_OPPONENT_POKEMON = exports.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON = exports.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON = exports.DEVOLVE_DEFENDING_AFTER_ATTACK = exports.DEVOLVE_POKEMON = exports.PLAY_POKEMON_FROM_HAND_TO_BENCH = exports.TAKE_X_MORE_PRIZE_CARDS = exports.TAKE_X_PRIZES = exports.TAKE_SPECIFIC_PRIZES = exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = exports.DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN = exports.DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG = exports.GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON = exports.TOOL_SET_HP_IF = exports.TOOL_ACTIVE_DAMAGE_BONUS = exports.COPY_OPPONENTS_LAST_ATTACK = exports.COPY_OPPONENT_ACTIVE_ATTACK = exports.COPY_BENCH_ATTACK = exports.NEXT_TURN_ATTACK_BASE_DAMAGE = exports.NEXT_TURN_ATTACK_BONUS = exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = exports.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND = exports.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH = exports.DISCARD_A_STADIUM_CARD_IN_PLAY = exports.PASSIVE_ABILITY_ACTIVATED = exports.ABILITY_USED = exports.MOVED_TO_ACTIVE_THIS_TURN = exports.JUST_EVOLVED = exports.AFTER_ATTACK = exports.WAS_POWER_USED = exports.PUT_DAMAGE = exports.DEAL_DAMAGE = exports.WAS_ATTACK_USED = void 0;
exports.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN = exports.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN = exports.BLOCK_IF_GX_ATTACK_USED = exports.BLOCK_IF_DISCARD_EMPTY = exports.BLOCK_IF_DECK_EMPTY = exports.BLOCK_IF_NO_SLOTS = exports.GET_PLAYER_BENCH_SLOTS = exports.GET_FIRST_PLAYER_BENCH_SLOT = exports.SIMULATE_COIN_FLIP = exports.FLIP_UNTIL_TAILS_AND_COUNT_HEADS = exports.MULTIPLE_COIN_FLIPS_PROMPT = exports.COIN_FLIP_PROMPT = exports.CONFIRMATION_PROMPT = exports.SELECT_PROMPT_WITH_OPTIONS = exports.SELECT_PROMPT = exports.SHOW_CARDS_TO_PLAYER = exports.MOVE_CARDS_TO_HAND = exports.LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN = exports.LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON = exports.LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY = exports.LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND = exports.LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING = exports.MOVE_DAMAGE_COUNTERS = exports.GUST_OPPONENT_BENCHED_POKEMON = exports.OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON = exports.SWITCH_OUT_OPPONENT_ACTIVE_POKEMON = exports.SWITCH_IN_OPPONENT_BENCHED_POKEMON = exports.SWITCH_ACTIVE_WITH_BENCHED = exports.MOVE_CARD_TO = exports.CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND = exports.IS_SPECIAL_ENERGY_BLOCKED = exports.IS_TOOL_BLOCKED = exports.IS_POKEMON_POWER_BLOCKED = exports.IS_POKEPOWER_BLOCKED = exports.IS_POKEBODY_BLOCKED = exports.IS_ABILITY_BLOCKED = exports.GET_CARDS_ON_BOTTOM_OF_DECK = exports.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND = exports.CLEAN_UP_SUPPORTER = exports.SEARCH_DECK_FOR_CARDS_TO_HAND = exports.DRAW_CARDS_AS_FACE_DOWN_PRIZES = exports.DRAW_CARDS_UNTIL_CARDS_IN_HAND = exports.DRAW_UP_TO_X_CARDS = exports.DRAW_CARDS = exports.SHUFFLE_PRIZES_INTO_DECK = exports.SHUFFLE_CARDS_INTO_DECK = exports.SHUFFLE_DECK = exports.GET_PRIZES_AS_CARD_ARRAY = exports.GET_PLAYER_PRIZES = exports.DISCARD_TOP_X_OF_OPPONENTS_DECK = void 0;
exports.TERA_RULE = exports.SURVIVE_ON_TEN_IF_FULL_HP = exports.PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS = exports.PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS = exports.ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT = exports.DAMAGED_FROM_FULL_HP = exports.PREVENT_DAMAGE = exports.BLOCK_RETREAT = exports.CAN_PLAY_CARD = exports.CAN_PLAY_POKEMON_CARD = exports.CAN_PLAY_ENERGY_CARD = exports.CAN_PLAY_TRAINER_CARD = exports.CAN_PLAY_SUPPORTER_CARD = exports.MOVE_CARDS = exports.BLOCK_RETREAT_IF_MARKER = exports.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN = exports.REPLACE_MARKER_AT_END_OF_TURN = exports.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN = exports.REMOVE_MARKER_AT_END_OF_TURN = exports.HAS_TAG = exports.PREVENT_DAMAGE_IF_SOURCE_HAS_TAG = exports.PREVENT_DAMAGE_IF_TARGET_HAS_MARKER = exports.BLOCK_EFFECT_IF_MARKER = exports.USE_ABILITY_ONCE_PER_TURN = exports.HAS_MARKER = exports.REMOVE_MARKER = exports.ADD_MARKER = exports.PREVENT_AND_CLEAR_SPECIAL_CONDITIONS = exports.ADD_CONFUSION_TO_PLAYER_ACTIVE = exports.ADD_PARALYZED_TO_PLAYER_ACTIVE = exports.ADD_BURN_TO_PLAYER_ACTIVE = exports.ADD_POISON_TO_PLAYER_ACTIVE = exports.ADD_SLEEP_TO_PLAYER_ACTIVE = exports.ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE = exports.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED = exports.BLOCK_IF_HAS_SPECIAL_CONDITION = void 0;
const __1 = require("../..");
const play_card_effects_1 = require("../effects/play-card-effects");
const card_types_1 = require("../card/card-types");
const state_1 = require("../state/state");
const pokemon_card_1 = require("../card/pokemon-card");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const choose_attack_prompt_1 = require("../prompts/choose-attack-prompt");
const effect_of_attack_effects_1 = require("../effects/effect-of-attack-effects");
const game_stats_tracker_1 = require("../game-stats-tracker");
/**
 *
 * A basic effect for checking the use of attacks.
 * @returns whether or not a specific attack was used.
 */
function WAS_ATTACK_USED(effect, index, user) {
    return effect instanceof game_effects_1.AttackEffect && effect.attack === user.attacks[index];
}
exports.WAS_ATTACK_USED = WAS_ATTACK_USED;
function DEAL_DAMAGE(effect) {
    return effect instanceof attack_effects_1.DealDamageEffect;
}
exports.DEAL_DAMAGE = DEAL_DAMAGE;
function PUT_DAMAGE(effect) {
    return effect instanceof attack_effects_1.PutDamageEffect;
}
exports.PUT_DAMAGE = PUT_DAMAGE;
/**
 *
 * A basic effect for checking the use of abilites.
 * @returns whether or not a specific ability was used.
 */
function WAS_POWER_USED(effect, index, user) {
    return effect instanceof game_effects_1.PowerEffect && effect.power === user.powers[index];
}
exports.WAS_POWER_USED = WAS_POWER_USED;
const AFTER_ATTACK = (effect, index, user) => {
    return effect instanceof game_phase_effects_1.AfterAttackEffect && effect.attack === user.attacks[index];
};
exports.AFTER_ATTACK = AFTER_ATTACK;
/**
 *
 * Checks whether or not the Pokemon just evolved.
 * @returns whether or not `effect` is an evolve effect from this card.
 */
function JUST_EVOLVED(effect, card) {
    return effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === card;
}
exports.JUST_EVOLVED = JUST_EVOLVED;
/**
 * Returns whether the given Pokemon moved from the player's Bench to the Active Spot this turn.
 * Uses engine-tracked player.movedToActiveThisTurn (cleared at turn start).
 */
function MOVED_TO_ACTIVE_THIS_TURN(player, pokemon) {
    return player.movedToActiveThisTurn.includes(pokemon.id);
}
exports.MOVED_TO_ACTIVE_THIS_TURN = MOVED_TO_ACTIVE_THIS_TURN;
/**
 * Adds the "ability used" board effect to the given Pokemon.
 */
function ABILITY_USED(player, card) {
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === card) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
}
exports.ABILITY_USED = ABILITY_USED;
/**
 *
 * A basic effect for checking whether or not a passive ability gets activated.
 * @returns whether or not a passive ability was activated.
 */
function PASSIVE_ABILITY_ACTIVATED(effect, user) {
    return effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(user);
}
exports.PASSIVE_ABILITY_ACTIVATED = PASSIVE_ABILITY_ACTIVATED;
/**
 *
 * @param state is the game state.
 * @returns the game state after discarding a stadium card in play.
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
/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, filter = {}, options = {}) {
    BLOCK_IF_DECK_EMPTY(player);
    const slots = GET_PLAYER_BENCH_SLOTS(player);
    BLOCK_IF_NO_SLOTS(slots);
    filter.superType = card_types_1.SuperType.POKEMON;
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, filter, options), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
            const playPokemonFromDeckEffect = new play_card_effects_1.PlayPokemonFromDeckEffect(player, card, slots[index]);
            store.reduceEffect(state, playPokemonFromDeckEffect);
        });
        SHUFFLE_DECK(store, state, player);
    });
}
exports.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH = SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH;
/**
 * Search deck for Pokemon, show it to the opponent, put it into `player`'s hand, and shuffle `player`'s deck.
 * A `filter` can be provided for the prompt as well.
 */
function SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, filter = {}, options = {}) {
    BLOCK_IF_DECK_EMPTY(player);
    const opponent = __1.StateUtils.getOpponent(state, player);
    filter.superType = card_types_1.SuperType.POKEMON;
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, filter, options), selected => {
        const cards = selected || [];
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHUFFLE_DECK(store, state, player);
    });
}
exports.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND = SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND;
function THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage) {
    effect.damage += damage;
    return state;
}
exports.THIS_ATTACK_DOES_X_MORE_DAMAGE = THIS_ATTACK_DOES_X_MORE_DAMAGE;
/**
 * Standard marker lifecycle for:
 * "During your next turn, this Pokemon's [Attack Name] attack does [N] more damage."
 *
 * Applies bonus when the same attack is used while marker is active and clears after that next turn.
 */
function NEXT_TURN_ATTACK_BONUS(effect, options) {
    const { attack, source, bonusDamage, bonusMarker, clearMarker } = options;
    if (effect instanceof game_effects_1.AttackEffect && effect.attack === attack) {
        // Guard against copied attacks: only apply when this source card is the attacker.
        if (source instanceof pokemon_card_1.PokemonCard && effect.source.getPokemonCard() !== source) {
            return;
        }
        if (HAS_MARKER(bonusMarker, effect.player, source)) {
            effect.damage += bonusDamage;
        }
        REMOVE_MARKER(clearMarker, effect.player, source);
        ADD_MARKER(bonusMarker, effect.player, source);
    }
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(bonusMarker, effect.player, source)) {
        if (HAS_MARKER(clearMarker, effect.player, source)) {
            REMOVE_MARKER(bonusMarker, effect.player, source);
            REMOVE_MARKER(clearMarker, effect.player, source);
        }
        else {
            ADD_MARKER(clearMarker, effect.player, source);
        }
    }
}
exports.NEXT_TURN_ATTACK_BONUS = NEXT_TURN_ATTACK_BONUS;
/**
 * Standard marker lifecycle for:
 * "During your next turn, this Pokemon's [Attack Name] attack's base damage is [N]."
 *
 * `setupAttack` is the attack that applies the marker and `boostedAttack` is the attack
 * whose base damage is overridden during the next turn.
 */
function NEXT_TURN_ATTACK_BASE_DAMAGE(effect, options) {
    const { setupAttack, boostedAttack, source, baseDamage, bonusMarker, clearMarker } = options;
    if (effect instanceof game_effects_1.AttackEffect) {
        // Guard against copied attacks: only apply when this source card is the attacker.
        if (source instanceof pokemon_card_1.PokemonCard && effect.source.getPokemonCard() !== source) {
            return;
        }
        if (effect.attack === boostedAttack && HAS_MARKER(bonusMarker, effect.player, source)) {
            effect.damage = baseDamage;
        }
        if (effect.attack === setupAttack) {
            REMOVE_MARKER(clearMarker, effect.player, source);
            ADD_MARKER(bonusMarker, effect.player, source);
        }
    }
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(bonusMarker, effect.player, source)) {
        if (HAS_MARKER(clearMarker, effect.player, source)) {
            REMOVE_MARKER(bonusMarker, effect.player, source);
            REMOVE_MARKER(clearMarker, effect.player, source);
        }
        else {
            ADD_MARKER(clearMarker, effect.player, source);
        }
    }
}
exports.NEXT_TURN_ATTACK_BASE_DAMAGE = NEXT_TURN_ATTACK_BASE_DAMAGE;
function* copyBenchAttackGenerator(next, store, state, effect, options) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const { allowCancel = false, throwIfNoBenchedPokemon = true, disallowCopycatAttack = true } = options;
    const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);
    if (!hasBenchedPokemon) {
        if (throwIfNoBenchedPokemon) {
            throw new __1.GameError(__1.GameMessage.CANNOT_USE_ATTACK);
        }
        return state;
    }
    let targets = [];
    yield store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { allowCancel }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const benchedPokemon = targets[0];
    const benchedCard = benchedPokemon.getPokemonCard();
    if (benchedCard === undefined || benchedCard.attacks.length === 0) {
        return state;
    }
    let selected = null;
    yield store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, __1.GameMessage.CHOOSE_ATTACK_TO_COPY, [benchedCard], { allowCancel }), result => {
        selected = result;
        next();
    });
    const copiedAttack = selected;
    if (copiedAttack === null) {
        return state;
    }
    if (disallowCopycatAttack && copiedAttack.copycatAttack === true) {
        return state;
    }
    store.log(state, __1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: copiedAttack.name
    });
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, copiedAttack);
    store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
/**
 * Generic implementation for:
 * "Choose 1 of your Benched Pokemon's attacks and use it as this attack."
 *
 * Call this inside your WAS_ATTACK_USED(...) block (optionally coin-gated).
 */
function COPY_BENCH_ATTACK(store, state, effect, options = {}) {
    const generator = copyBenchAttackGenerator(() => generator.next(), store, state, effect, options);
    return generator.next().value;
}
exports.COPY_BENCH_ATTACK = COPY_BENCH_ATTACK;
/**
 * "Choose 1 of your opponent's Active Pokemon's attacks and use it as this attack."
 * Used by: Zoroark (Foul Play), Krookodile (Foul Play), Mew ex (Genome Hacking), etc.
 */
function* copyOpponentActiveAttackGenerator(next, store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const pokemonCard = opponent.active.getPokemonCard();
    if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
    }
    let selected;
    yield store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, __1.GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], { allowCancel: false }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    if (attack === null || attack.copycatAttack === true) {
        return state;
    }
    store.log(state, __1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
    });
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
function COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect) {
    const generator = copyOpponentActiveAttackGenerator(() => generator.next(), store, state, effect);
    return generator.next().value;
}
exports.COPY_OPPONENT_ACTIVE_ATTACK = COPY_OPPONENT_ACTIVE_ATTACK;
/**
 * "If your opponent's Pokemon used an attack during their last turn, use it as this attack."
 * Used by: Mimikyu (Copycat), Sudowoodo (Watch and Learn), etc.
 */
function* copyOpponentsLastAttackGenerator(next, store, state, effect) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const lastAttackInfo = state.playerLastAttack[opponent.id];
    if (!lastAttackInfo) {
        return state;
    }
    const { attack: lastAttack, sourceCard } = lastAttackInfo;
    if (lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        return state;
    }
    store.log(state, __1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: lastAttack.name
    });
    const copiedAttackEffect = new game_effects_1.AttackEffect(player, opponent, lastAttack);
    copiedAttackEffect.source = player.active;
    copiedAttackEffect.target = opponent.active;
    // Call the source card's reduceEffect directly so attack logic runs even if card is not in play
    state = sourceCard.reduceEffect(store, state, copiedAttackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (copiedAttackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    const afterAttackEffect = new game_phase_effects_1.AfterAttackEffect(player, opponent, lastAttack);
    state = store.reduceEffect(state, afterAttackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    return state;
}
function COPY_OPPONENTS_LAST_ATTACK(store, state, effect) {
    const generator = copyOpponentsLastAttackGenerator(() => generator.next(), store, state, effect);
    return generator.next().value;
}
exports.COPY_OPPONENTS_LAST_ATTACK = COPY_OPPONENTS_LAST_ATTACK;
/**
 * Standard Tool damage hook for text like:
 * "If this card is attached to [condition], each of its attacks does [N] more damage
 * to the Active Pokemon (before applying Weakness and Resistance)."
 */
function TOOL_ACTIVE_DAMAGE_BONUS(store, state, effect, tool, options) {
    if (!(effect instanceof attack_effects_1.DealDamageEffect) || !effect.source.tools.includes(tool)) {
        return;
    }
    if (IS_TOOL_BLOCKED(store, state, effect.player, tool)) {
        return;
    }
    const sourcePokemon = effect.source.getPokemonCard();
    if (sourcePokemon === undefined) {
        return;
    }
    if (options.sourcePokemonName !== undefined && sourcePokemon.name !== options.sourcePokemonName) {
        return;
    }
    if (options.sourceCardTag !== undefined && !sourcePokemon.tags.includes(options.sourceCardTag)) {
        return;
    }
    if (options.sourceCardType !== undefined) {
        const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonTypeEffect);
        if (!checkPokemonTypeEffect.cardTypes.includes(options.sourceCardType)) {
            return;
        }
    }
    const opponent = __1.StateUtils.getOpponent(state, effect.player);
    if (effect.target !== opponent.active || effect.damage <= 0) {
        return;
    }
    effect.damage += options.damageBonus;
}
exports.TOOL_ACTIVE_DAMAGE_BONUS = TOOL_ACTIVE_DAMAGE_BONUS;
/**
 * Standard Tool HP hook for text like:
 * "If this card is attached to [condition], its maximum HP is [N]."
 */
function TOOL_SET_HP_IF(store, state, effect, tool, options) {
    if (!(effect instanceof check_effects_1.CheckHpEffect) || !effect.target.tools.includes(tool)) {
        return;
    }
    if (IS_TOOL_BLOCKED(store, state, effect.player, tool)) {
        return;
    }
    const sourcePokemon = effect.target.getPokemonCard();
    if (sourcePokemon === undefined) {
        return;
    }
    if (options.sourcePokemonName !== undefined && sourcePokemon.name !== options.sourcePokemonName) {
        return;
    }
    if (options.sourceCardTag !== undefined && !sourcePokemon.tags.includes(options.sourceCardTag)) {
        return;
    }
    if (options.sourceCardType !== undefined) {
        const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, checkPokemonTypeEffect);
        if (!checkPokemonTypeEffect.cardTypes.includes(options.sourceCardType)) {
            return;
        }
    }
    effect.hp = options.hp;
}
exports.TOOL_SET_HP_IF = TOOL_SET_HP_IF;
function GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(player, store, state) {
    let totalEnergy = 0;
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
            totalEnergy += 1;
        });
    });
    return totalEnergy;
}
exports.GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON = GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON;
function DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, damage, ...cardTags) {
    const opponent = __1.StateUtils.getOpponent(state, effect.player);
    const opponentActive = opponent.active.getPokemonCard();
    let includesAnyTags = false;
    for (const tag of cardTags) {
        if (opponentActive && opponentActive.tags.includes(tag)) {
            includesAnyTags = true;
        }
    }
    if (includesAnyTags) {
        effect.damage += damage;
    }
}
exports.DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG = DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG;
function DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, damage) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    effect.damage = effect.attack.damage + (opponent.prizesTaken * damage);
}
exports.DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN = DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN;
function HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, damage);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
    return state;
}
exports.HEAL_X_DAMAGE_FROM_THIS_POKEMON = HEAL_X_DAMAGE_FROM_THIS_POKEMON;
function THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user) {
    // TODO: Would like to check if Pokemon has damage without needing the effect
    const player = effect.player;
    const source = player.active;
    // Check if source Pokemon has damage
    const damage = source.damage;
    return damage > 0;
}
exports.THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT = THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT;
function YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state) {
    // TODO: this shouldn't work for attacks with damage counters, but I think it will
    return effect instanceof game_effects_1.KnockOutEffect;
}
exports.YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK = YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK;
function TAKE_SPECIFIC_PRIZES(store, state, player, prizes, options = {}) {
    let { destination = player.hand } = options;
    const { skipReduce = false } = options;
    let preventDefault = false;
    if (!skipReduce) {
        const drawPrizesEffect = new game_effects_1.DrawPrizesEffect(player, prizes, destination);
        // Reduce the prizes destination for effects that override it and take place before any
        // DrawPrizesEffect is processed (e.g. Barbaracle LOR)
        const prizesDestinationEffect = new check_effects_1.CheckPrizesDestinationEffect(player, drawPrizesEffect.destination);
        store.reduceEffect(state, prizesDestinationEffect);
        // If nothing prevented the override, apply the new destination
        if (!prizesDestinationEffect.preventDefault) {
            drawPrizesEffect.destination = prizesDestinationEffect.destination;
        }
        // Process the actual DrawPrizesEffect
        store.reduceEffect(state, drawPrizesEffect);
        preventDefault = drawPrizesEffect.preventDefault;
        destination = drawPrizesEffect.destination;
    }
    else {
        destination = player.hand;
    }
    if (!preventDefault) {
        let prizesTakenCount = 0;
        prizes.forEach(prize => {
            if (player.prizes.includes(prize)) {
                prize.moveTo(destination);
                if (destination === player.hand) {
                    // If the destination is the hand, we've "taken" a prize
                    player.prizesTaken += 1;
                    player.prizesTakenThisTurn += 1;
                    prizesTakenCount += 1;
                }
            }
        });
        // Track accurate prize count using GameStatsTracker
        if (prizesTakenCount > 0) {
            game_stats_tracker_1.GameStatsTracker.trackPrizeTaken(player, prizesTakenCount);
        }
    }
}
exports.TAKE_SPECIFIC_PRIZES = TAKE_SPECIFIC_PRIZES;
function TAKE_X_PRIZES(store, state, player, count, options = {}, callback) {
    const { promptOptions = {} } = options, takeOptions = __rest(options, ["promptOptions"]);
    state = store.prompt(state, new __1.ChoosePrizePrompt(player.id, __1.GameMessage.CHOOSE_PRIZE_CARD, Object.assign({ count, allowCancel: false }, promptOptions)), result => {
        TAKE_SPECIFIC_PRIZES(store, state, player, result, takeOptions);
        if (callback)
            callback(result);
    });
    return state;
}
exports.TAKE_X_PRIZES = TAKE_X_PRIZES;
function TAKE_X_MORE_PRIZE_CARDS(effect, state) {
    effect.prizeCount += 1;
    return state;
}
exports.TAKE_X_MORE_PRIZE_CARDS = TAKE_X_MORE_PRIZE_CARDS;
function PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, card) {
    const slot = GET_FIRST_PLAYER_BENCH_SLOT(player);
    player.hand.moveCardTo(card, slot);
    slot.pokemonPlayedTurn = state.turn;
}
exports.PLAY_POKEMON_FROM_HAND_TO_BENCH = PLAY_POKEMON_FROM_HAND_TO_BENCH;
function DEVOLVE_POKEMON(store, state, target, destination) {
    const pokemons = target.getPokemons();
    const pokemonCard = target.getPokemonCard();
    // Weird ass lv.x stuff (yes this is actually the way it works: https://www.pokebeach.com/forums/threads/devolving-lvl-x.34943/)
    if (pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_LV_X)) {
        // The lv.x is on a basic -> do nothing
        if (pokemons.length === 2 && pokemons.some(p => p.stage === card_types_1.Stage.BASIC)) {
            return state;
        }
        else {
            const cardsToDevolve = pokemons.filter(p => p.name === pokemonCard.name);
            MOVE_CARDS(store, state, target, destination, { cards: cardsToDevolve });
            target.clearEffects();
            target.pokemonPlayedTurn = state.turn;
        }
        return state;
    }
    // Handle normal devolutions
    if (pokemons.length > 1 && !(pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VUNION)) && !(pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.tags.includes(card_types_1.CardTag.LEGEND))) {
        MOVE_CARD_TO(state, pokemonCard, destination);
        target.clearEffects();
        target.pokemonPlayedTurn = state.turn;
    }
}
exports.DEVOLVE_POKEMON = DEVOLVE_POKEMON;
/**
 * Compound helper for text like:
 * "Devolve the Defending Pokemon and put the highest Stage Evolution card on it into your opponent's hand/deck/discard/Lost Zone."
 */
function DEVOLVE_DEFENDING_AFTER_ATTACK(store, state, effect, index, user, destination = 'hand') {
    if (!(0, exports.AFTER_ATTACK)(effect, index, user)) {
        return state;
    }
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    let destinationList = opponent.hand;
    if (destination === 'deck') {
        destinationList = opponent.deck;
    }
    else if (destination === 'discard') {
        destinationList = opponent.discard;
    }
    else if (destination === 'lostzone') {
        destinationList = opponent.lostzone;
    }
    DEVOLVE_POKEMON(store, state, opponent.active, destinationList);
    return state;
}
exports.DEVOLVE_DEFENDING_AFTER_ATTACK = DEVOLVE_DEFENDING_AFTER_ATTACK;
function THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state, min, max, applyWeaknessAndResistance = false, slots) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const targets = opponent.bench.filter(b => b.cards.length > 0);
    if (targets.length === 0 && !(slots === null || slots === void 0 ? void 0 : slots.includes(__1.SlotType.ACTIVE))) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, slots !== null && slots !== void 0 ? slots : [__1.SlotType.BENCH], { min: min, max: max, allowCancel: false }), selected => {
        selected.forEach(target => {
            if (effect.target === effect.opponent.active) {
                const damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
                damageEffect.target = target;
                return store.reduceEffect(state, damageEffect);
            }
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
            damageEffect.target = target;
            if (applyWeaknessAndResistance && damage > 0) {
                const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, damage);
                applyWeakness.target = target; // Fix: should be the current target, not effect.target
                state = store.reduceEffect(state, applyWeakness);
                damageEffect.damage = applyWeakness.damage; // Fix: update the damage for this damageEffect, not effect.damage
            }
            store.reduceEffect(state, damageEffect);
        });
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON;
function THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state, benchOnly = false) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (cardList, card) => {
        if (effect.target === effect.opponent.active && !benchOnly) {
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
            damageEffect.target = cardList;
            return store.reduceEffect(state, damageEffect);
        }
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
    });
}
exports.THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON = THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON;
function THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, amount) {
    const dealDamage = new attack_effects_1.DealDamageEffect(effect, amount);
    dealDamage.target = effect.source;
    return store.reduceEffect(state, dealDamage);
}
exports.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF = THIS_POKEMON_DOES_DAMAGE_TO_ITSELF;
function DAMAGE_OPPONENT_POKEMON(store, state, effect, damage, targets) {
    const player = effect.player;
    const opponent = __1.StateUtils.getOpponent(state, player);
    targets.forEach(target => {
        // Use DealDamageEffect if target is opponent's active Pokémon (applies Weakness/Resistance)
        if (target === opponent.active) {
            const damageEffect = new attack_effects_1.DealDamageEffect(effect, damage);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
        }
        else {
            // Use PutDamageEffect for benched Pokémon (doesn't apply Weakness/Resistance)
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
        }
    });
}
exports.DAMAGE_OPPONENT_POKEMON = DAMAGE_OPPONENT_POKEMON;
function ATTACH_ENERGY_PROMPT(store, state, player, playerType, sourceSlot, destinationSlots, filter = {}, options = {}) {
    filter.superType = card_types_1.SuperType.ENERGY;
    const source = player.getSlot(sourceSlot);
    return store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_CARDS, source, playerType, destinationSlots, filter, options), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card;
            const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
        }
        if (sourceSlot === __1.SlotType.DECK) {
            SHUFFLE_DECK(store, state, player);
        }
    });
}
exports.ATTACH_ENERGY_PROMPT = ATTACH_ENERGY_PROMPT;
function DISCARD_X_ENERGY_FROM_YOUR_HAND(effect, store, state, minAmount, maxAmount) {
    const player = effect.player;
    const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof __1.EnergyCard;
    });
    if (!hasEnergyInHand) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: minAmount, max: maxAmount }), cards => {
        cards = cards || [];
        if (cards.length === 0) {
            return;
        }
        player.hand.moveCardsTo(cards, player.discard);
    });
}
exports.DISCARD_X_ENERGY_FROM_YOUR_HAND = DISCARD_X_ENERGY_FROM_YOUR_HAND;
/**
 * Discard a specific set of Energies of the player's choice from this Pokémon (e.g. 3 [R] energy). Not restricted to Basics.
 * @param energyMap The Energies that must be discarded.
 */
function DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON(store, state, effect, energyMap) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyMap, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
    });
}
exports.DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON = DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON;
function PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND(store, state, effect, energyMap) {
    const player = effect.player;
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_CARD_TO_HAND, checkProvidedEnergy.energyMap, energyMap, { allowCancel: false }), energy => {
        const cards = (energy || []).map(e => e.card);
        MOVE_CARDS(store, state, player.active, player.hand, { cards: cards });
    });
}
exports.PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND = PUT_SPECIFIC_ENERGY_FROM_THIS_POKEMON_INTO_HAND;
function DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, card) {
    const player = effect.player;
    const cardList = __1.StateUtils.findCardList(state, card);
    if (!(cardList instanceof __1.PokemonCardList))
        throw new __1.GameError(__1.GameMessage.INVALID_TARGET);
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const cards = checkProvidedEnergy.energyMap.map(e => e.card);
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    discardEnergy.target = cardList;
    store.reduceEffect(state, discardEnergy);
}
exports.DISCARD_ALL_ENERGY_FROM_POKEMON = DISCARD_ALL_ENERGY_FROM_POKEMON;
const BASIC_ENERGY_NAME_BY_CARD_TYPE = {
    [card_types_1.CardType.GRASS]: 'Grass Energy',
    [card_types_1.CardType.FIRE]: 'Fire Energy',
    [card_types_1.CardType.WATER]: 'Water Energy',
    [card_types_1.CardType.LIGHTNING]: 'Lightning Energy',
    [card_types_1.CardType.PSYCHIC]: 'Psychic Energy',
    [card_types_1.CardType.FIGHTING]: 'Fighting Energy',
    [card_types_1.CardType.DARK]: 'Darkness Energy',
    [card_types_1.CardType.METAL]: 'Metal Energy',
    [card_types_1.CardType.DRAGON]: 'Dragon Energy',
    [card_types_1.CardType.FAIRY]: 'Fairy Energy'
};
function getBasicEnergyNameByType(cardType) {
    return BASIC_ENERGY_NAME_BY_CARD_TYPE[cardType];
}
function getBlockedTargetsFromFilter(player, targetFilter) {
    if (targetFilter === undefined) {
        return [];
    }
    const blockedTargets = [];
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
        if (!targetFilter(cardList, pokemonCard)) {
            blockedTargets.push(target);
        }
    });
    return blockedTargets;
}
/**
 * Compound helper for text like:
 * "As often as you like during your turn, attach a basic [type] Energy card from your hand to 1 of your Pokémon."
 *
 * This helper does not include "once per turn" tracking. Pair it with
 * `USE_ABILITY_ONCE_PER_TURN` when card text requires that limit.
 */
function AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND(store, state, player, cardType, options = {}) {
    const { destinationSlots = [__1.SlotType.BENCH, __1.SlotType.ACTIVE], targetFilter, promptOptions = {} } = options;
    const basicEnergyName = getBasicEnergyNameByType(cardType);
    if (basicEnergyName === undefined) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    const hasMatchingEnergyInHand = player.hand.cards.some(card => card instanceof __1.EnergyCard
        && card.energyType === card_types_1.EnergyType.BASIC
        && card.name === basicEnergyName);
    if (!hasMatchingEnergyInHand) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    const blockedTo = getBlockedTargetsFromFilter(player, targetFilter);
    return store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, __1.PlayerType.BOTTOM_PLAYER, destinationSlots, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: basicEnergyName }, Object.assign({ allowCancel: true, min: 1, max: 1, blockedTo }, promptOptions)), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card;
            const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
        }
    });
}
exports.AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND = AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND;
/**
 * Compound helper for text like:
 * "Attach up to X [type] Energy cards from your discard pile to 1 of your Pokémon."
 *
 * `cardType` is optional. When omitted, any Energy is legal.
 */
function ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, amount, cardType, options = {}) {
    const { destinationSlots = [__1.SlotType.BENCH, __1.SlotType.ACTIVE], targetFilter, energyFilter = {}, min = 1, allowCancel = false, onAttached } = options;
    if (player.discard.cards.length === 0 || amount <= 0) {
        return state;
    }
    const blockedTo = getBlockedTargetsFromFilter(player, targetFilter);
    const promptEnergyFilter = Object.assign({ superType: card_types_1.SuperType.ENERGY }, energyFilter);
    const promptOptions = {
        allowCancel,
        min: Math.max(0, min),
        max: amount,
        sameTarget: true,
        blockedTo
    };
    if (cardType !== undefined) {
        promptOptions.validCardTypes = [cardType];
    }
    return store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, __1.PlayerType.BOTTOM_PLAYER, destinationSlots, promptEnergyFilter, promptOptions), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card;
            const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
        }
        if (onAttached !== undefined) {
            onAttached(transfers);
        }
    });
}
exports.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON = ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON;
/**
 * Compound helper for text like:
 * "Attach up to X Energy cards from your deck to Y of your Pokémon."
 *
 * - `maxEnergyCards` controls how many Energy cards may be attached.
 * - `maxPokemonTargets` controls how many different Pokémon may receive those attachments.
 * - For Mirage Gate-style behavior, pass:
 *   `differentTypes: true`, `energyFilter: { energyType: EnergyType.BASIC }`.
 */
function ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, state, player, maxEnergyCards, maxPokemonTargets, options = {}) {
    const { destinationSlots = [__1.SlotType.BENCH, __1.SlotType.ACTIVE], targetFilter, energyFilter = {}, min = 0, allowCancel = false, differentTypes = false, differentTargets = false, sameTarget = false, validCardTypes, maxPerType, onAttached } = options;
    if (player.deck.cards.length === 0 || maxEnergyCards <= 0 || maxPokemonTargets <= 0) {
        return state;
    }
    const blockedTo = getBlockedTargetsFromFilter(player, targetFilter);
    return store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, __1.PlayerType.BOTTOM_PLAYER, destinationSlots, Object.assign({ superType: card_types_1.SuperType.ENERGY }, energyFilter), {
        allowCancel,
        min: Math.max(0, min),
        max: maxEnergyCards,
        blockedTo,
        differentTypes,
        differentTargets,
        sameTarget,
        validCardTypes,
        maxPerType
    }), transfers => {
        transfers = transfers || [];
        const uniqueTargets = new Set(transfers.map(transfer => `${transfer.to.player}-${transfer.to.slot}-${transfer.to.index}`));
        if (uniqueTargets.size > maxPokemonTargets) {
            throw new __1.GameError(__1.GameMessage.INVALID_PROMPT_RESULT);
        }
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card;
            const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
        }
        if (onAttached !== undefined) {
            onAttached(transfers);
        }
        SHUFFLE_DECK(store, state, player);
    });
}
exports.ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON = ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON;
/**
 * Discards the top `amount` cards of your own deck (self-mill).
 */
function DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, amount, card, sourceEffect) {
    return MOVE_CARDS(store, state, player.deck, player.discard, { count: amount, sourceCard: card, sourceEffect });
}
exports.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK = DISCARD_TOP_X_CARDS_FROM_YOUR_DECK;
/**
 * Counts cards in one of your zones using a partial field filter and/or predicate.
 * Useful for effects like Night March / United Wings that need custom matching logic.
 */
function COUNT_MATCHING_CARDS_IN_ZONE(player, zone, filter = {}, predicate = () => true) {
    const cards = zone === 'discard' ? player.discard.cards : player.lostzone.cards;
    return cards.reduce((count, card) => {
        for (const key in filter) {
            if (card[key] !== filter[key]) {
                return count;
            }
        }
        if (!predicate(card)) {
            return count;
        }
        return count + 1;
    }, 0);
}
exports.COUNT_MATCHING_CARDS_IN_ZONE = COUNT_MATCHING_CARDS_IN_ZONE;
/**
 * Checks whether a Pokémon has any Energy card attached.
 */
function THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED(target) {
    return target.cards.some(card => card instanceof __1.EnergyCard);
}
exports.THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED = THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED;
/**
 * Convenience guard for cards that can only be used if your VSTAR Power is still available.
 */
function BLOCK_IF_VSTAR_POWER_USED(player) {
    if (player.usedVSTAR === true) {
        throw new __1.GameError(__1.GameMessage.LABEL_VSTAR_USED);
    }
}
exports.BLOCK_IF_VSTAR_POWER_USED = BLOCK_IF_VSTAR_POWER_USED;
/**
 * Returns true if the given player has already used their VSTAR Power this game.
 */
function PLAYER_HAS_USED_VSTAR_POWER(player) {
    return player.usedVSTAR === true;
}
exports.PLAYER_HAS_USED_VSTAR_POWER = PLAYER_HAS_USED_VSTAR_POWER;
/**
 * Returns true if your opponent has already used their VSTAR Power this game.
 */
function OPPONENT_HAS_USED_VSTAR_POWER(state, player) {
    const opponent = __1.StateUtils.getOpponent(state, player);
    return opponent.usedVSTAR === true;
}
exports.OPPONENT_HAS_USED_VSTAR_POWER = OPPONENT_HAS_USED_VSTAR_POWER;
/**
 * Discards the top `amount` cards of the opponent's deck (commonly called "milling").
 * @param player The player ***using*** this effect. Their opponent will be milled.
 * @param amount The number of cards to discard.
 * @param card The card causing the effect.
 * @param sourceEffect The attack or ability causing the effect.
 */
function DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, player, amount, card, sourceEffect) {
    const opponent = __1.StateUtils.getOpponent(state, player);
    MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: amount, sourceCard: card, sourceEffect: sourceEffect });
}
exports.DISCARD_TOP_X_OF_OPPONENTS_DECK = DISCARD_TOP_X_OF_OPPONENTS_DECK;
/**
 * A getter for the player's prize slots.
 * @returns A list of card lists containing the player's prize slots.
 */
function GET_PLAYER_PRIZES(player) {
    return player.prizes.filter(p => p.cards.length > 0);
}
exports.GET_PLAYER_PRIZES = GET_PLAYER_PRIZES;
/**
 * A getter for all of a player's prizes.
 * @returns A Card[] of all the player's prize cards.
 */
function GET_PRIZES_AS_CARD_ARRAY(player) {
    const prizes = player.prizes.filter(p => p.cards.length > 0);
    const allPrizeCards = [];
    prizes.forEach(p => allPrizeCards.push(...p.cards));
    return allPrizeCards;
}
exports.GET_PRIZES_AS_CARD_ARRAY = GET_PRIZES_AS_CARD_ARRAY;
/**
 * Shuffles the player's deck.
 */
function SHUFFLE_DECK(store, state, player) {
    return store.prompt(state, new __1.ShuffleDeckPrompt(player.id), order => player.deck.applyOrder(order));
}
exports.SHUFFLE_DECK = SHUFFLE_DECK;
/**
 * Puts a list of cards into the deck, then shuffles the deck.
 */
function SHUFFLE_CARDS_INTO_DECK(store, state, player, cards) {
    cards.forEach(card => {
        player.deck.cards.unshift(card);
    });
    SHUFFLE_DECK(store, state, player);
}
exports.SHUFFLE_CARDS_INTO_DECK = SHUFFLE_CARDS_INTO_DECK;
/**
 * Shuffle the prize cards into the deck.
 */
function SHUFFLE_PRIZES_INTO_DECK(store, state, player) {
    SHUFFLE_CARDS_INTO_DECK(store, state, player, GET_PRIZES_AS_CARD_ARRAY(player));
    GET_PLAYER_PRIZES(player).forEach(p => p.cards = []);
}
exports.SHUFFLE_PRIZES_INTO_DECK = SHUFFLE_PRIZES_INTO_DECK;
/**
 * Draws `count` cards, putting them into your hand.
 */
function DRAW_CARDS(player, count) {
    player.deck.moveTo(player.hand, Math.min(count, player.deck.cards.length));
}
exports.DRAW_CARDS = DRAW_CARDS;
/**
 * Draws up to `count` cards, letting the player choose to draw fewer than the maximum.
 *
 * TODO: this should also allow the player to draw them 1 by 1 if they want
 */
function DRAW_UP_TO_X_CARDS(store, state, player, count) {
    if (count > 0) {
        const options = [];
        for (let i = count; i >= 0; i--) {
            options.push({ message: `Draw ${i} card(s)`, value: i });
        }
        store.prompt(state, new __1.SelectPrompt(player.id, __1.GameMessage.WANT_TO_DRAW_CARDS, options.map(c => c.message), { allowCancel: false }), choice => {
            const numCardsToDraw = options[choice].value;
            DRAW_CARDS(player, numCardsToDraw);
        });
    }
}
exports.DRAW_UP_TO_X_CARDS = DRAW_UP_TO_X_CARDS;
/**
 * Draws cards until you have `count` cards in hand.
 */
function DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, count) {
    player.deck.moveTo(player.hand, Math.max(count - player.hand.cards.length, 0));
}
exports.DRAW_CARDS_UNTIL_CARDS_IN_HAND = DRAW_CARDS_UNTIL_CARDS_IN_HAND;
/**
 * Draws `count` cards from the top of your deck as face down prize cards.
 */
function DRAW_CARDS_AS_FACE_DOWN_PRIZES(player, count) {
    // Draw cards from the top of the deck to the prize cards
    for (let i = 0; i < count; i++) {
        const card = player.deck.cards.pop();
        if (card) {
            const prize = player.prizes.find(p => p.cards.length === 0);
            if (prize) {
                prize.cards.push(card);
            }
            else {
                player.deck.cards.push(card);
            }
        }
    }
    // Set the new prize cards to be face down
    player.prizes.forEach(p => p.isSecret = true);
}
exports.DRAW_CARDS_AS_FACE_DOWN_PRIZES = DRAW_CARDS_AS_FACE_DOWN_PRIZES;
function SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, sourceCard, filter = {}, options = {}, sourceEffect) {
    if (player.deck.cards.length === 0)
        return;
    const opponent = __1.StateUtils.getOpponent(state, player);
    store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, filter, options), selected => {
        const cards = selected || [];
        if (Object.keys(filter).length > 0) {
            cards.forEach(card => {
                store.log(state, __1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard, sourceEffect });
        SHUFFLE_DECK(store, state, player);
    });
}
exports.SEARCH_DECK_FOR_CARDS_TO_HAND = SEARCH_DECK_FOR_CARDS_TO_HAND;
// Made this so that we can easily change behavior for older formats in the future
function CLEAN_UP_SUPPORTER(store, effect, player) {
    const format = store.handler.format;
    if (!(format === card_types_1.Format.RSPK || format === card_types_1.Format.RETRO) || effect.trainerCard.trainerType !== card_types_1.TrainerType.SUPPORTER) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
}
exports.CLEAN_UP_SUPPORTER = CLEAN_UP_SUPPORTER;
/**
 * Search discard pile for card, show it to the opponent, put it into `player`'s hand.
 * A `filter` can be provided for the prompt as well.
 */
function SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, sourceCard, filter = {}, options = {}, sourceEffect) {
    if (player.discard.cards.length === 0)
        return;
    const opponent = __1.StateUtils.getOpponent(state, player);
    store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, filter, options), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
            return state;
        }
        // Create the move effect and reduce it to check if it will be prevented
        const moveEffect = new game_effects_1.MoveCardsEffect(player.discard, player.hand, { cards, sourceCard, sourceEffect });
        state = store.reduceEffect(state, moveEffect);
        // Only log and show cards if the move wasn't prevented
        if (!moveEffect.preventDefault) {
            cards.forEach(card => {
                store.log(state, __1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
        return state;
    });
}
exports.SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND = SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND;
function GET_CARDS_ON_BOTTOM_OF_DECK(player, amount = 1) {
    const start = player.deck.cards.length < amount ? 0 : player.deck.cards.length - amount;
    const end = player.deck.cards.length;
    return player.deck.cards.slice(start, end);
}
exports.GET_CARDS_ON_BOTTOM_OF_DECK = GET_CARDS_ON_BOTTOM_OF_DECK;
/**
 * Checks if abilities are blocked on `card` for `player`.
 * @returns `true` if the ability is blocked, `false` if the ability is able to go thru.
 */
function IS_ABILITY_BLOCKED(store, state, player, card) {
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.ABILITY,
            text: ''
        }, card));
    }
    catch (_a) {
        return true;
    }
    return false;
}
exports.IS_ABILITY_BLOCKED = IS_ABILITY_BLOCKED;
/**
 * Checks if pokebodies are blocked on `card` for `player`.
 * @returns `true` if the pokebody is blocked, `false` if the pokebody is able to go thru.
 */
function IS_POKEBODY_BLOCKED(store, state, player, card) {
    // Try to reduce PowerEffect, to check if something is blocking our pokebody
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEBODY,
            text: ''
        }, card));
    }
    catch (_a) {
        return true;
    }
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEMON_POWER,
            text: ''
        }, card));
    }
    catch (_b) {
        return true;
    }
    return false;
}
exports.IS_POKEBODY_BLOCKED = IS_POKEBODY_BLOCKED;
/**
 * Checks if pokepowers are blocked on `card` for `player`.
 * @returns `true` if the pokepower is blocked, `false` if the pokepower is able to go thru.
 */
function IS_POKEPOWER_BLOCKED(store, state, player, card) {
    // Try to reduce PowerEffect, to check if something is blocking our pokepower
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEPOWER,
            text: ''
        }, card));
    }
    catch (_a) {
        return true;
    }
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEMON_POWER,
            text: ''
        }, card));
    }
    catch (_b) {
        return true;
    }
    return false;
}
exports.IS_POKEPOWER_BLOCKED = IS_POKEPOWER_BLOCKED;
/**
 * Checks if pokemon powers are blocked on `card` for `player`.
 * @returns `true` if the pokemon power is blocked, `false` if the pokepower is able to go thru.
 */
function IS_POKEMON_POWER_BLOCKED(store, state, player, card) {
    // Try to reduce PowerEffect for POKEMON_POWER
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEMON_POWER,
            text: ''
        }, card));
    }
    catch (_a) {
        return true;
    }
    // Try both POKEPOWER and POKEBODY, return true only if BOTH are blocked
    let pokePowerBlocked = false;
    let pokeBodyBlocked = false;
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEPOWER,
            text: ''
        }, card));
    }
    catch (_b) {
        pokePowerBlocked = true;
    }
    try {
        store.reduceEffect(state, new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: __1.PowerType.POKEBODY,
            text: ''
        }, card));
    }
    catch (_c) {
        pokeBodyBlocked = true;
    }
    // Return true only if both POKEPOWER and POKEBODY are blocked
    return pokePowerBlocked && pokeBodyBlocked;
    // Ruling: if both pokePower and pokeBody are blocked, then the pokemon power is blocked.
}
exports.IS_POKEMON_POWER_BLOCKED = IS_POKEMON_POWER_BLOCKED;
/**
 * Checks if a tool's effect is being blocked
 * @returns `true` if the tool's effect is blocked, `false` if the tool's effect is able to activate.
 */
function IS_TOOL_BLOCKED(store, state, player, card) {
    // Try to reduce ToolEffect, to check if something is blocking the tool from working
    try {
        const stub = new play_card_effects_1.ToolEffect(player, card);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return true;
    }
    return false;
}
exports.IS_TOOL_BLOCKED = IS_TOOL_BLOCKED;
/**
 * Checks if a special energy's effect is being blocked for the given player and Pokemon it is attached to. Do not use in CheckProvidedEnergyEffect.
 * @returns `true` if the special energy's effect is blocked, `false` if the special energy's effect is able to activate.
 */
function IS_SPECIAL_ENERGY_BLOCKED(store, state, player, card, attachedTo, exemptFromOpponentsSpecialEnergyBlockingAbility = false) {
    // Try to reduce SpecialEnergyEffect, to check if something is blocking the effect
    try {
        const stub = new game_effects_1.SpecialEnergyEffect(player, card, attachedTo, exemptFromOpponentsSpecialEnergyBlockingAbility);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return true;
    }
    return false;
}
exports.IS_SPECIAL_ENERGY_BLOCKED = IS_SPECIAL_ENERGY_BLOCKED;
function CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state, player, pokemon) {
    if (state.turn === 2) {
        player.canEvolve = true;
        pokemon.pokemonPlayedTurn = state.turn - 1;
    }
}
exports.CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND = CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND;
/**
 * Finds `card` and moves it from its current CardList to `destination`.
 */
function MOVE_CARD_TO(state, card, destination) {
    __1.StateUtils.findCardList(state, card).moveCardTo(card, destination);
}
exports.MOVE_CARD_TO = MOVE_CARD_TO;
function SWITCH_ACTIVE_WITH_BENCHED(store, state, player) {
    const hasBenched = player.bench.some(b => b.cards.length > 0);
    if (!hasBenched)
        return state;
    store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { allowCancel: false }), selected => {
        if (!selected || selected.length === 0)
            return state;
        const target = selected[0];
        player.switchPokemon(target, store, state);
    });
}
exports.SWITCH_ACTIVE_WITH_BENCHED = SWITCH_ACTIVE_WITH_BENCHED;
/**
 * Compound helper for "switch in" effects:
 * "Switch 1 of your opponent's Benched Pokémon with their Active Pokémon."
 */
function SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, options = {}) {
    const { allowCancel = false, blocked = [], onSwitched } = options;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const hasBenchedPokemon = opponent.bench.some(bench => bench.cards.length > 0);
    if (!hasBenchedPokemon) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH], { min: 1, max: 1, allowCancel, blocked }), selected => {
        if (!selected || selected.length === 0) {
            return;
        }
        opponent.switchPokemon(selected[0], store, state);
        if (onSwitched !== undefined) {
            onSwitched(selected[0]);
        }
    });
}
exports.SWITCH_IN_OPPONENT_BENCHED_POKEMON = SWITCH_IN_OPPONENT_BENCHED_POKEMON;
/**
 * Compound helper for text like:
 * "Switch out your opponent's Active Pokémon to the Bench.
 * (Your opponent chooses the new Active Pokémon.)"
 *
 * Common on effects like Repel and the opponent-facing part of Escape Rope.
 */
function SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, options = {}) {
    const { allowCancel = false, blocked = [], onSwitched } = options;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const hasBenchedPokemon = opponent.bench.some(bench => bench.cards.length > 0);
    if (!hasBenchedPokemon) {
        return state;
    }
    return store.prompt(state, new __1.ChoosePokemonPrompt(opponent.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { min: 1, max: 1, allowCancel, blocked }), selected => {
        if (!selected || selected.length === 0) {
            return;
        }
        opponent.switchPokemon(selected[0], store, state);
        if (onSwitched !== undefined) {
            onSwitched(selected[0]);
        }
    });
}
exports.SWITCH_OUT_OPPONENT_ACTIVE_POKEMON = SWITCH_OUT_OPPONENT_ACTIVE_POKEMON;
/**
 * Backward-compatible alias for `SWITCH_OUT_OPPONENT_ACTIVE_POKEMON`.
 */
function OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON(store, state, player, options = {}) {
    return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, options);
}
exports.OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON = OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON;
/**
 * Backward-compatible alias for `SWITCH_IN_OPPONENT_BENCHED_POKEMON`.
 */
function GUST_OPPONENT_BENCHED_POKEMON(store, state, player, options = {}) {
    return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, options);
}
exports.GUST_OPPONENT_BENCHED_POKEMON = GUST_OPPONENT_BENCHED_POKEMON;
/**
 * Generic helper for text like:
 * "Move X damage counters from Y to Z."
 */
function MOVE_DAMAGE_COUNTERS(store, state, player, options = {}) {
    const moveEffect = new game_effects_1.MoveDamageCountersEffect(player);
    state = store.reduceEffect(state, moveEffect);
    if (moveEffect.preventDefault) {
        return state;
    }
    const { playerType = __1.PlayerType.BOTTOM_PLAYER, slots = [__1.SlotType.ACTIVE, __1.SlotType.BENCH], min = 1, max = undefined, allowCancel = false, blockedFrom = [], blockedTo = [], singleSourceTarget = false, singleDestinationTarget = false } = options;
    const opponent = __1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    const computedBlockedFrom = [...blockedFrom];
    const collectTargets = (targetPlayer, targetPlayerType) => {
        targetPlayer.forEachPokemon(targetPlayerType, (cardList, card, target) => {
            maxAllowedDamage.push({ target, damage: 9999 });
            if (cardList.damage === 0) {
                computedBlockedFrom.push(target);
            }
        });
    };
    if (playerType === __1.PlayerType.BOTTOM_PLAYER || playerType === __1.PlayerType.ANY) {
        collectTargets(player, __1.PlayerType.BOTTOM_PLAYER);
    }
    if (playerType === __1.PlayerType.TOP_PLAYER || playerType === __1.PlayerType.ANY) {
        collectTargets(opponent, __1.PlayerType.TOP_PLAYER);
    }
    if (maxAllowedDamage.length === 0) {
        return state;
    }
    return store.prompt(state, new __1.MoveDamagePrompt(player.id, __1.GameMessage.MOVE_DAMAGE, playerType, slots, maxAllowedDamage, {
        allowCancel,
        min,
        max,
        blockedFrom: computedBlockedFrom,
        blockedTo,
        singleSourceTarget,
        singleDestinationTarget
    }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const source = __1.StateUtils.getTarget(state, player, transfer.from);
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            if (source.damage < 10) {
                continue;
            }
            source.damage -= 10;
            target.damage += 10;
        }
    });
}
exports.MOVE_DAMAGE_COUNTERS = MOVE_DAMAGE_COUNTERS;
function cardMatchesPartialFilter(card, filter) {
    for (const key in filter) {
        if (card[key] !== filter[key]) {
            return false;
        }
    }
    return true;
}
function moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination) {
    if (topCards.cards.length === 0) {
        return;
    }
    if (remainderDestination === 'discard') {
        topCards.moveTo(player.discard);
        return;
    }
    if (remainderDestination === 'lostzone') {
        topCards.moveTo(player.lostzone);
        return;
    }
    if (remainderDestination === 'bottom') {
        player.deck.cards.push(...topCards.cards);
        topCards.cards = [];
        return;
    }
    player.deck.cards = [...topCards.cards, ...player.deck.cards];
    topCards.cards = [];
    SHUFFLE_DECK(store, state, player);
}
/**
 * Core engine for "Look at the top X cards..." effects.
 *
 * Note: `onCardsChosen` is intended for synchronous card moves. If your effect
 * needs additional prompts (for example target selection), use the dedicated
 * wrapper helpers below instead.
 */
function LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING(store, state, player, options) {
    const { topCount, maxMatches, filter = {}, predicate = () => true, chooseMessage = __1.GameMessage.CHOOSE_CARD_TO_HAND, allowCancel = false, remainderDestination = 'shuffle', onCardsChosen } = options;
    if (player.deck.cards.length === 0 || topCount <= 0 || maxMatches < 0) {
        return state;
    }
    const topCards = new __1.CardList();
    player.deck.moveTo(topCards, Math.min(topCount, player.deck.cards.length));
    const blocked = [];
    let matchingCount = 0;
    topCards.cards.forEach((card, index) => {
        const matches = cardMatchesPartialFilter(card, filter) && predicate(card);
        if (matches) {
            matchingCount += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const selectable = Math.min(maxMatches, matchingCount);
    if (selectable === 0) {
        moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination);
        return state;
    }
    return store.prompt(state, new __1.ChooseCardsPrompt(player, chooseMessage, topCards, {}, { min: 0, max: selectable, allowCancel, blocked }), selected => {
        const chosenCards = selected || [];
        onCardsChosen(chosenCards, topCards);
        moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination);
    });
}
exports.LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING = LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING;
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck, put up to Y matching cards into your hand,
 * and move the rest [shuffle/bottom/discard/lostzone]."
 */
function LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(store, state, player, topCount, maxToHand, options = {}) {
    const { filter = {}, predicate = () => true, revealChosenCards = false, remainderDestination = 'shuffle', sourceCard, sourceEffect } = options;
    return LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING(store, state, player, {
        topCount,
        maxMatches: maxToHand,
        filter,
        predicate,
        chooseMessage: __1.GameMessage.CHOOSE_CARD_TO_HAND,
        remainderDestination,
        onCardsChosen: (chosenCards, topCards) => {
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (revealChosenCards && chosenCards.length > 0) {
                SHOW_CARDS_TO_PLAYER(store, state, opponent, chosenCards);
            }
            MOVE_CARDS(store, state, topCards, player.hand, { cards: chosenCards, sourceCard, sourceEffect });
        }
    });
}
exports.LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND = LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND;
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck and attach up to Y matching Energy cards
 * to your Pokémon in play."
 */
function LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(store, state, player, topCount, maxEnergyToAttach, options = {}) {
    const { destinationSlots = [__1.SlotType.BENCH, __1.SlotType.ACTIVE], targetFilter, energyFilter = {}, remainderDestination = 'shuffle', differentTypes = false, differentTargets = false, sameTarget = false, validCardTypes, maxPerType, maxPokemonTargets = maxEnergyToAttach } = options;
    if (player.deck.cards.length === 0 || topCount <= 0 || maxEnergyToAttach <= 0) {
        return state;
    }
    const topCards = new __1.CardList();
    player.deck.moveTo(topCards, Math.min(topCount, player.deck.cards.length));
    const matchingEnergyCount = topCards.cards.filter(card => card instanceof __1.EnergyCard && cardMatchesPartialFilter(card, energyFilter)).length;
    const maxAttach = Math.min(maxEnergyToAttach, matchingEnergyCount);
    const blockedTo = getBlockedTargetsFromFilter(player, targetFilter);
    return store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_CARDS, topCards, __1.PlayerType.BOTTOM_PLAYER, destinationSlots, Object.assign({ superType: card_types_1.SuperType.ENERGY }, energyFilter), {
        allowCancel: false,
        min: 0,
        max: maxAttach,
        blockedTo,
        differentTypes,
        differentTargets,
        sameTarget,
        validCardTypes,
        maxPerType
    }), transfers => {
        transfers = transfers || [];
        const uniqueTargets = new Set(transfers.map(transfer => `${transfer.to.player}-${transfer.to.slot}-${transfer.to.index}`));
        if (uniqueTargets.size > maxPokemonTargets) {
            throw new __1.GameError(__1.GameMessage.INVALID_PROMPT_RESULT);
        }
        for (const transfer of transfers) {
            const target = __1.StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card;
            const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
        }
        moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination);
    });
}
exports.LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY = LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY;
/**
 * Compound helper for text like:
 * "Look at the top X cards of your deck and put up to Y matching Pokémon onto your Bench."
 */
function LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON(store, state, player, topCount, maxToBench, options = {}) {
    const { filter = {}, predicate = () => true, remainderDestination = 'shuffle' } = options;
    if (player.deck.cards.length === 0 || topCount <= 0 || maxToBench <= 0) {
        return state;
    }
    const benchSlots = GET_PLAYER_BENCH_SLOTS(player);
    if (benchSlots.length === 0) {
        return state;
    }
    const topCards = new __1.CardList();
    player.deck.moveTo(topCards, Math.min(topCount, player.deck.cards.length));
    const blocked = [];
    let matchingPokemonCount = 0;
    topCards.cards.forEach((card, index) => {
        const pokemonCard = card instanceof pokemon_card_1.PokemonCard ? card : undefined;
        const matches = pokemonCard !== undefined
            && cardMatchesPartialFilter(pokemonCard, filter)
            && predicate(pokemonCard);
        if (matches) {
            matchingPokemonCount += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const selectable = Math.min(maxToBench, benchSlots.length, matchingPokemonCount);
    if (selectable === 0) {
        moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination);
        return state;
    }
    return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, topCards, {}, { min: 0, max: selectable, allowCancel: false, blocked }), selected => {
        const chosenPokemon = selected || [];
        chosenPokemon.forEach((card, index) => {
            topCards.moveCardTo(card, benchSlots[index]);
            benchSlots[index].pokemonPlayedTurn = state.turn;
        });
        moveRemainingTopDeckCards(store, state, player, topCards, remainderDestination);
    });
}
exports.LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON = LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON;
function LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, choosingPlayer, deckPlayer) {
    {
        BLOCK_IF_DECK_EMPTY(deckPlayer);
        const deckTop = new __1.CardList();
        deckPlayer.deck.moveTo(deckTop, 1);
        SHOW_CARDS_TO_PLAYER(store, state, choosingPlayer, deckTop.cards);
        SELECT_PROMPT_WITH_OPTIONS(store, state, choosingPlayer, __1.GameMessage.CHOOSE_OPTION, [{
                message: __1.GameMessage.DISCARD_FROM_TOP_OF_DECK,
                action: () => deckTop.moveToTopOfDestination(deckPlayer.discard),
            },
            {
                message: __1.GameMessage.RETURN_TO_TOP_OF_DECK,
                action: () => deckTop.moveToTopOfDestination(deckPlayer.deck),
            }]);
    }
}
exports.LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN = LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN;
function MOVE_CARDS_TO_HAND(store, state, player, cards) {
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, player.hand);
        store.log(state, __1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
}
exports.MOVE_CARDS_TO_HAND = MOVE_CARDS_TO_HAND;
function SHOW_CARDS_TO_PLAYER(store, state, player, cards) {
    if (cards.length === 0)
        return state;
    return store.prompt(state, new __1.ShowCardsPrompt(player.id, __1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
}
exports.SHOW_CARDS_TO_PLAYER = SHOW_CARDS_TO_PLAYER;
function SELECT_PROMPT(store, state, player, values, callback) {
    return store.prompt(state, new __1.SelectPrompt(player.id, __1.GameMessage.CHOOSE_OPTION, values, { allowCancel: false }), callback);
}
exports.SELECT_PROMPT = SELECT_PROMPT;
function SELECT_PROMPT_WITH_OPTIONS(store, state, player, message, options) {
    return store.prompt(state, new __1.SelectPrompt(player.id, message, options.map(opt => opt.message), { allowCancel: false }), choice => {
        const option = options[choice];
        option.action();
    });
}
exports.SELECT_PROMPT_WITH_OPTIONS = SELECT_PROMPT_WITH_OPTIONS;
function CONFIRMATION_PROMPT(store, state, player, callback, message = __1.GameMessage.WANT_TO_USE_ABILITY) {
    return store.prompt(state, new __1.ConfirmPrompt(player.id, message), callback);
}
exports.CONFIRMATION_PROMPT = CONFIRMATION_PROMPT;
function COIN_FLIP_PROMPT(store, state, player, callback) {
    const coinFlip = new play_card_effects_1.CoinFlipEffect(player, callback);
    return store.reduceEffect(state, coinFlip);
}
exports.COIN_FLIP_PROMPT = COIN_FLIP_PROMPT;
function MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, amount, callback) {
    const sequenceEffect = new play_card_effects_1.CoinFlipSequenceEffect(player, amount, callback);
    return store.reduceEffect(state, sequenceEffect);
}
exports.MULTIPLE_COIN_FLIPS_PROMPT = MULTIPLE_COIN_FLIPS_PROMPT;
/**
 * Reusable "flip coins until tails" helper.
 * Returns the number of heads via callback.
 */
function FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, callback) {
    const sequenceEffect = new play_card_effects_1.CoinFlipSequenceEffect(player, 'untilTails', (results) => {
        const headsCount = results.filter(r => r).length;
        callback(headsCount);
    });
    return store.reduceEffect(state, sequenceEffect);
}
exports.FLIP_UNTIL_TAILS_AND_COUNT_HEADS = FLIP_UNTIL_TAILS_AND_COUNT_HEADS;
function SIMULATE_COIN_FLIP(store, state, player) {
    const result = Math.random() < 0.5;
    const gameMessage = result ? __1.GameLog.LOG_PLAYER_FLIPS_HEADS : __1.GameLog.LOG_PLAYER_FLIPS_TAILS;
    store.log(state, gameMessage, { name: player.name });
    return result;
}
exports.SIMULATE_COIN_FLIP = SIMULATE_COIN_FLIP;
function GET_FIRST_PLAYER_BENCH_SLOT(player) {
    const slots = GET_PLAYER_BENCH_SLOTS(player);
    BLOCK_IF_NO_SLOTS(slots);
    return slots[0];
}
exports.GET_FIRST_PLAYER_BENCH_SLOT = GET_FIRST_PLAYER_BENCH_SLOT;
function GET_PLAYER_BENCH_SLOTS(player) {
    return player.bench.filter(b => b.cards.length === 0);
}
exports.GET_PLAYER_BENCH_SLOTS = GET_PLAYER_BENCH_SLOTS;
function BLOCK_IF_NO_SLOTS(slots) {
    if (slots.length === 0)
        throw new __1.GameError(__1.GameMessage.NO_BENCH_SLOTS_AVAILABLE);
}
exports.BLOCK_IF_NO_SLOTS = BLOCK_IF_NO_SLOTS;
function BLOCK_IF_DECK_EMPTY(player) {
    if (player.deck.cards.length === 0)
        throw new __1.GameError(__1.GameMessage.NO_CARDS_IN_DECK);
}
exports.BLOCK_IF_DECK_EMPTY = BLOCK_IF_DECK_EMPTY;
function BLOCK_IF_DISCARD_EMPTY(player) {
    if (player.discard.cards.length === 0)
        throw new __1.GameError(__1.GameMessage.NO_CARDS_IN_DISCARD);
}
exports.BLOCK_IF_DISCARD_EMPTY = BLOCK_IF_DISCARD_EMPTY;
function BLOCK_IF_GX_ATTACK_USED(player) {
    if (player.usedGX === true)
        throw new __1.GameError(__1.GameMessage.LABEL_GX_USED);
}
exports.BLOCK_IF_GX_ATTACK_USED = BLOCK_IF_GX_ATTACK_USED;
/**
 * Helper for text like:
 * "This Pokémon can't use [Attack Name] during your next turn."
 *
 * Uses the built-in pending attack lock list, so no marker cleanup is required.
 */
function THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player, attack) {
    const attackName = typeof attack === 'string' ? attack : attack.name;
    if (!player.active.cannotUseAttacksNextTurnPending.includes(attackName)) {
        player.active.cannotUseAttacksNextTurnPending.push(attackName);
    }
}
exports.THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN = THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN;
/**
 * Helper for text like:
 * "This Pokémon can't attack during your next turn."
 */
function THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player) {
    player.active.cannotAttackNextTurnPending = true;
}
exports.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN = THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN;
function BLOCK_IF_HAS_SPECIAL_CONDITION(player, source) {
    if (player.active.getPokemonCard() === source && player.active.specialConditions.length > 0)
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
}
exports.BLOCK_IF_HAS_SPECIAL_CONDITION = BLOCK_IF_HAS_SPECIAL_CONDITION;
function BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, source) {
    // "any Pokemon Power on any Pokemon that says it stops working if the Pokemon is Paralyzed, Asleep, or Confused, 
    // now should ALSO include Poisoned, or Burned as well." - (Jan 17, 2002 WotC Chat, Q1278 & Q1284)
    // I was unaware of this errata when I originally made this and BLOCK_IF_HAS_SPECIAL_CONDITION, so I updated it to do the same thing. 
    if (player.active.getPokemonCard() === source && player.active.specialConditions.length > 0)
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
}
exports.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED = BLOCK_IF_ASLEEP_CONFUSED_PARALYZED;
//#region Special Conditions
function ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, specialConditions, poisonDamage = 10, burnDamage = 20, sleepFlips = 1, confusionDamage = 30) {
    store.reduceEffect(state, new check_effects_1.AddSpecialConditionsPowerEffect(player, source, player.active, specialConditions, poisonDamage, burnDamage, sleepFlips, confusionDamage));
}
exports.ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE = ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE;
function ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, source, sleepFlips = 1) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.ASLEEP], 10, 20, sleepFlips);
}
exports.ADD_SLEEP_TO_PLAYER_ACTIVE = ADD_SLEEP_TO_PLAYER_ACTIVE;
function ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, source, poisonDamage = 10) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.POISONED], poisonDamage);
}
exports.ADD_POISON_TO_PLAYER_ACTIVE = ADD_POISON_TO_PLAYER_ACTIVE;
function ADD_BURN_TO_PLAYER_ACTIVE(store, state, player, source, burnDamage = 20) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.BURNED], 10, burnDamage);
}
exports.ADD_BURN_TO_PLAYER_ACTIVE = ADD_BURN_TO_PLAYER_ACTIVE;
function ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, player, source) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.PARALYZED]);
}
exports.ADD_PARALYZED_TO_PLAYER_ACTIVE = ADD_PARALYZED_TO_PLAYER_ACTIVE;
function ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, source, confusionDamage = 30) {
    ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, [card_types_1.SpecialCondition.CONFUSED], 10, 20, 1, confusionDamage);
}
exports.ADD_CONFUSION_TO_PLAYER_ACTIVE = ADD_CONFUSION_TO_PLAYER_ACTIVE;
/**
 * Compound helper for text like:
 * "Pokémon that meet [condition] can't be affected by Special Conditions, and recover from them."
 *
 * Call this in reduceEffect and pass card-specific matching logic via `shouldApply`.
 */
function PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state, effect, options) {
    const { shouldApply, clearDuringCheckTableState = true } = options;
    if (effect instanceof attack_effects_1.AddSpecialConditionsEffect || effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
        const owner = __1.StateUtils.findOwner(state, effect.target);
        if (shouldApply(effect.target, owner)) {
            effect.preventDefault = true;
        }
        return;
    }
    if (clearDuringCheckTableState && effect instanceof check_effects_1.CheckTableStateEffect) {
        state.players.forEach(player => {
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.specialConditions.length > 0 && shouldApply(cardList, player)) {
                    cardList.clearAllSpecialConditions();
                }
            });
        });
    }
}
exports.PREVENT_AND_CLEAR_SPECIAL_CONDITIONS = PREVENT_AND_CLEAR_SPECIAL_CONDITIONS;
//#endregion
//#region Markers
function ADD_MARKER(marker, owner, source) {
    owner.marker.addMarker(marker, source);
}
exports.ADD_MARKER = ADD_MARKER;
function REMOVE_MARKER(marker, owner, source) {
    return owner.marker.removeMarker(marker, source);
}
exports.REMOVE_MARKER = REMOVE_MARKER;
function HAS_MARKER(marker, owner, source) {
    return owner.marker.hasMarker(marker, source);
}
exports.HAS_MARKER = HAS_MARKER;
/**
 * Enforce "Once during your turn" for activated abilities.
 * Call this after all card-specific validation, right before applying the ability effect.
 * Pair with REMOVE_MARKER_AT_END_OF_TURN(effect, marker, source) in reduceEffect.
 */
function USE_ABILITY_ONCE_PER_TURN(player, marker, source) {
    if (HAS_MARKER(marker, player, source)) {
        throw new __1.GameError(__1.GameMessage.POWER_ALREADY_USED);
    }
    ADD_MARKER(marker, player, source);
}
exports.USE_ABILITY_ONCE_PER_TURN = USE_ABILITY_ONCE_PER_TURN;
function BLOCK_EFFECT_IF_MARKER(marker, owner, source) {
    if (HAS_MARKER(marker, owner, source))
        throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
}
exports.BLOCK_EFFECT_IF_MARKER = BLOCK_EFFECT_IF_MARKER;
function PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, marker, source) {
    if (effect instanceof attack_effects_1.PutDamageEffect && HAS_MARKER(marker, effect.target, source))
        effect.preventDefault = true;
}
exports.PREVENT_DAMAGE_IF_TARGET_HAS_MARKER = PREVENT_DAMAGE_IF_TARGET_HAS_MARKER;
function PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect, tag, source) {
    if (effect instanceof attack_effects_1.PutDamageEffect && HAS_TAG(tag, source))
        effect.preventDefault = true;
}
exports.PREVENT_DAMAGE_IF_SOURCE_HAS_TAG = PREVENT_DAMAGE_IF_SOURCE_HAS_TAG;
function HAS_TAG(tag, source) {
    return source.tags.includes(tag);
}
exports.HAS_TAG = HAS_TAG;
function REMOVE_MARKER_AT_END_OF_TURN(effect, marker, source) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(marker, effect.player, source))
        REMOVE_MARKER(marker, effect.player, source);
}
exports.REMOVE_MARKER_AT_END_OF_TURN = REMOVE_MARKER_AT_END_OF_TURN;
function REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker, source) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(marker, effect.player.active, source))
        REMOVE_MARKER(marker, effect.player.active, source);
}
exports.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN = REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN;
function REPLACE_MARKER_AT_END_OF_TURN(effect, oldMarker, newMarker, source) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(oldMarker, effect.player, source)) {
        REMOVE_MARKER(oldMarker, effect.player, source);
        ADD_MARKER(newMarker, effect.player, source);
    }
}
exports.REPLACE_MARKER_AT_END_OF_TURN = REPLACE_MARKER_AT_END_OF_TURN;
/**
 * If an EndTurnEffect is given, will check for `clearerMarker` on the player whose turn it is,
 * and clear all of the player or opponent's `pokemonMarker`s.
 * Useful for "During your opponent's next turn" effects.
 */
function CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, clearerMarker, pokemonMarker, source) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect && HAS_MARKER(clearerMarker, effect.player, source)) {
        REMOVE_MARKER(clearerMarker, effect.player, source);
        const opponent = __1.StateUtils.getOpponent(state, effect.player);
        REMOVE_MARKER(pokemonMarker, opponent, source);
        opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (cardList) => REMOVE_MARKER(pokemonMarker, cardList, source));
    }
}
exports.CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN = CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN;
function BLOCK_RETREAT_IF_MARKER(effect, marker, source) {
    if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(marker, source))
        throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
}
exports.BLOCK_RETREAT_IF_MARKER = BLOCK_RETREAT_IF_MARKER;
//#endregion
function MOVE_CARDS(store, state, source, destination, options = {}) {
    return store.reduceEffect(state, new game_effects_1.MoveCardsEffect(source, destination, options));
}
exports.MOVE_CARDS = MOVE_CARDS;
// export function REMOVE_TOOL(store: StoreLike, state: State, source: PokemonCardList, tool: Card, destinationSlot: SlotType): State {
//   if (!source.cards.includes(tool)) {
//     return state;
//   }
//   const owner = StateUtils.findOwner(state, source);
//   state = MOVE_CARDS(store, state, source, owner.getSlot(destinationSlot), { cards: [tool] });
//   source.removeTool(tool);
//   return state;
// }
// export function REMOVE_TOOLS_FROM_POKEMON_PROMPT(store: StoreLike, state: State, player: Player, target: PokemonCardList, destinationSlot: SlotType, min: number, max: number): State {
//   if (target.tools.length === 0) {
//     return state;
//   }
//   if (target.tools.length === 1) {
//     return REMOVE_TOOL(store, state, target, target.tools[0], destinationSlot);
//   } else {
//     const blocked: number[] = [];
//     target.cards.forEach((card, index) => {
//       if (!target.tools.includes(card)) {
//         blocked.push(index);
//       }
//     });
//     let tools: Card[] = [];
//     return store.prompt(state, new ChooseCardsPrompt(
//       player,
//       GameMessage.CHOOSE_CARD_TO_DISCARD,
//       target,
//       {},
//       { min, max, allowCancel: false, blocked }
//     ), selected => {
//       tools = selected || [];
//       for (const tool of tools) {
//         return REMOVE_TOOL(store, state, target, tool, destinationSlot);
//       }
//     });
//   }
// }
// export function CHOOSE_TOOLS_TO_REMOVE_PROMPT(store: StoreLike, state: State, player: Player, playerType: PlayerType, destinationSlot: SlotType, min: number, max: number): State {
//   const opponent = StateUtils.getOpponent(state, player);
//   let hasPokemonWithTool = false;
//   let players: Player[] = [];
//   switch (playerType) {
//     case PlayerType.TOP_PLAYER:
//       players = [opponent];
//       break;
//     case PlayerType.BOTTOM_PLAYER:
//       players = [player];
//       break;
//     case PlayerType.ANY:
//       players = [player, opponent];
//       break;
//   }
//   const blocked: CardTarget[] = [];
//   for (const p of players) {
//     let pt: PlayerType = PlayerType.BOTTOM_PLAYER;
//     if (p === opponent) {
//       pt = PlayerType.TOP_PLAYER;
//     }
//     p.forEachPokemon(pt, (cardList, card, target) => {
//       if (cardList.tools.length > 0) {
//         hasPokemonWithTool = true;
//       } else {
//         blocked.push(target);
//       }
//     });
//   }
//   if (!hasPokemonWithTool) {
//     return state;
//   }
//   let targets: PokemonCardList[] = [];
//   return store.prompt(state, new ChoosePokemonPrompt(
//     player.id,
//     GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
//     playerType,
//     [SlotType.ACTIVE, SlotType.BENCH],
//     { min, max, allowCancel: false, blocked }
//   ), results => {
//     targets = results || [];
//     if (targets.length === 0) {
//       return state;
//     }
//     let toolsRemoved = 0;
//     for (const target of targets) {
//       if (target.tools.length === 0 || toolsRemoved >= max) {
//         continue;
//       }
//       if (target.tools.length === 1) {
//         REMOVE_TOOL(store, state, target, target.tools[0], destinationSlot);
//         toolsRemoved += 1;
//       } else {
//         const blocked: number[] = [];
//         target.cards.forEach((card, index) => {
//           if (!target.tools.includes(card)) {
//             blocked.push(index);
//           }
//         });
//         let tools: Card[] = [];
//         return store.prompt(state, new ChooseCardsPrompt(
//           player,
//           GameMessage.CHOOSE_CARD_TO_DISCARD,
//           target,
//           {},
//           { min: Math.min(min, max - toolsRemoved), max: max - toolsRemoved, allowCancel: false, blocked }
//         ), selected => {
//           tools = selected || [];
//           for (const tool of tools) {
//             REMOVE_TOOL(store, state, target, tool, destinationSlot);
//             toolsRemoved += 1;
//           }
//         });
//       }
//     }
//   });
/**
 * Validates if a supporter card can be played under current game conditions
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The supporter card to validate
 * @param bypassSupporterTurn If true, temporarily bypasses the supporterTurn check (for abilities that copy supporters)
 * @returns true if the card can be played, false otherwise
 */
function CAN_PLAY_SUPPORTER_CARD(store, state, player, trainerCard, bypassSupporterTurn = false) {
    try {
        // Store original supporterTurn value if bypassing
        const originalSupporterTurn = bypassSupporterTurn ? player.supporterTurn : undefined;
        // Temporarily set supporterTurn to 0 if bypassing the check
        if (bypassSupporterTurn) {
            player.supporterTurn = 0;
        }
        try {
            // Create a temporary TrainerEffect to test if the card can be played
            const testEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
            // Try to reduce the effect to see if it throws an error
            // We need to catch the error to prevent the game from crashing
            try {
                store.reduceEffect(state, testEffect);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        finally {
            // Restore original supporterTurn value if we bypassed it
            if (bypassSupporterTurn && originalSupporterTurn !== undefined) {
                player.supporterTurn = originalSupporterTurn;
            }
        }
    }
    catch (error) {
        return false;
    }
}
exports.CAN_PLAY_SUPPORTER_CARD = CAN_PLAY_SUPPORTER_CARD;
/**
 * Validates if a trainer card can be played under current game conditions
 * Dynamically checks by attempting to execute the card's logic and catching GameError
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param trainerCard The trainer card to validate
 * @returns true if the card can be played, false otherwise
 */
function CAN_PLAY_TRAINER_CARD(store, state, player, trainerCard) {
    try {
        // Only check during player's turn
        if (state.phase !== state_1.GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
            return false;
        }
        // Check basic trainer type restrictions first (fast path)
        switch (trainerCard.trainerType) {
            case card_types_1.TrainerType.SUPPORTER:
                // Can't play supporter on turn 1 unless card allows it
                if (state.turn === 1 && !trainerCard.firstTurn) {
                    return false;
                }
                // Can't play supporter if one already played this turn
                // Check supporterTurn (incremented when supporter is played) and supporter.cards (card in play area)
                if (player.supporterTurn > 0) {
                    return false;
                }
                break;
            case card_types_1.TrainerType.STADIUM: {
                const stadium = __1.StateUtils.getStadiumCard(state);
                const isHyperrogueOverPrismTower = trainerCard.name === 'Hyperrogue Ange Floette' && (stadium === null || stadium === void 0 ? void 0 : stadium.name) === 'Prism Tower';
                // Can't play stadium if one already played this turn (unless Hyperrogue Ange Floette over Prism Tower)
                if (player.stadiumPlayedTurn === state.turn && !isHyperrogueOverPrismTower) {
                    return false;
                }
                // Can't play same stadium already in play
                if (stadium && stadium.name === trainerCard.name) {
                    return false;
                }
                break;
            }
            case card_types_1.TrainerType.TOOL: {
                // Check if there are Pokemon that can accept a tool
                let canAttachTool = false;
                player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
                    if (Array.isArray(cardList.tools) && cardList.tools.length < pokemonCard.maxTools) {
                        canAttachTool = true;
                    }
                });
                if (!canAttachTool) {
                    return false;
                }
                break;
            }
            // Items have no basic restrictions beyond being in player's turn
        }
        // Check for Item/Tool blocking effects directly (no cloning needed)
        if (trainerCard.trainerType === card_types_1.TrainerType.ITEM) {
            // Check for marker-based blocks (Budew, etc.)
            if (player.marker.hasMarker('OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER')) {
                return false;
            }
            // Check for ability-based blocks (Jellicent ex, etc.)
            const opponent = __1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.name === 'Jellicent ex') {
                // Check if ability is blocked
                if (!IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
                    return false; // Blocked by ability
                }
            }
            // Check for ATTACK_EFFECT_ITEM_LOCK marker
            if (player.marker.hasMarker(player.ATTACK_EFFECT_ITEM_LOCK)) {
                return false;
            }
        }
        if (trainerCard.trainerType === card_types_1.TrainerType.TOOL) {
            // Check for ability-based blocks (Jellicent ex, etc.)
            const opponent = __1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.name === 'Jellicent ex') {
                // Check if ability is blocked
                if (!IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
                    return false; // Blocked by ability
                }
            }
            // Check for ATTACK_EFFECT_TOOL_LOCK marker
            if (player.marker.hasMarker(player.ATTACK_EFFECT_TOOL_LOCK)) {
                return false;
            }
        }
        // Rely on canPlay method for card-specific validation
        if (trainerCard.canPlay) {
            const canPlayResult = trainerCard.canPlay(store, state, player);
            if (canPlayResult !== undefined) {
                return canPlayResult; // Use canPlay result
            }
        }
        // If canPlay is not implemented or returns undefined
        // For Tool and Stadium cards, if we've passed all basic checks, return true
        // (Stadium checks already done: stadiumPlayedTurn, same-name stadium in play)
        if (trainerCard.trainerType === card_types_1.TrainerType.TOOL) {
            return true; // Tool cards can be played if Pokemon can accept them
        }
        if (trainerCard.trainerType === card_types_1.TrainerType.STADIUM) {
            return true; // Stadiums are playable unless already played one this turn (checked above)
        }
        // For other trainer types, err on the side of caution
        // We can't validate card-specific requirements without canPlay
        return false;
    }
    catch (error) {
        return false;
    }
}
exports.CAN_PLAY_TRAINER_CARD = CAN_PLAY_TRAINER_CARD;
/**
 * Validates if an energy card can be played under current game conditions
 * NOTE: This only checks basic conditions, not card-specific requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param energyCard The energy card to validate
 * @returns true if the card can be played, false otherwise
 */
function CAN_PLAY_ENERGY_CARD(store, state, player, energyCard) {
    try {
        // Only check during player's turn
        if (state.phase !== state_1.GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
            return false;
        }
        // Check if player has any Pokemon in play to attach energy to
        const hasActivePokemon = player.active.cards.length > 0;
        const hasBenchPokemon = player.bench.some(bench => bench.cards.length > 0);
        if (!hasActivePokemon && !hasBenchPokemon) {
            return false;
        }
        // Check if energy was already played this turn (unless unlimited)
        if (!player.usedDragonsWish && !state.rules.unlimitedEnergyAttachments) {
            if (player.energyPlayedTurn === state.turn) {
                return false;
            }
        }
        // Basic validation passed - return true
        // Card-specific requirements will be validated when actually playing
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.CAN_PLAY_ENERGY_CARD = CAN_PLAY_ENERGY_CARD;
/**
 * Validates if a pokemon card can be played under current game conditions
 * Checks basic conditions and evolution requirements
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param pokemonCard The pokemon card to validate
 * @returns true if the card can be played, false otherwise
 */
function CAN_PLAY_POKEMON_CARD(store, state, player, pokemonCard) {
    try {
        // Only check during player's turn
        if (state.phase !== state_1.GamePhase.PLAYER_TURN || state.players[state.activePlayer].id !== player.id) {
            return false;
        }
        // Check if there's space on bench (max 5 bench Pokemon)
        const benchCount = player.bench.filter(b => b.cards.length > 0).length;
        if (benchCount >= 5 && pokemonCard.stage === card_types_1.Stage.BASIC) {
            return false;
        }
        // For evolution cards, check if base Pokemon is in play AND can be evolved
        if (pokemonCard.stage !== card_types_1.Stage.BASIC) {
            // Check active Pokemon
            const activePokemon = player.active.getPokemonCard();
            let canEvolveActive = false;
            if (activePokemon) {
                const matchesEvolution = activePokemon.name === pokemonCard.evolvesFrom ||
                    activePokemon.evolvesTo.includes(pokemonCard.name) ||
                    activePokemon.evolvesToStage.includes(pokemonCard.stage) ||
                    (Array.isArray(activePokemon.evolvesFromBase) && activePokemon.evolvesFromBase.length > 0 && activePokemon.evolvesFromBase.includes(pokemonCard.evolvesFrom));
                if (matchesEvolution) {
                    // Check if Pokemon was played this turn (can't evolve if played this turn)
                    if (player.active.pokemonPlayedTurn < state.turn) {
                        canEvolveActive = true;
                    }
                }
            }
            // Check bench Pokemon
            let canEvolveBench = false;
            for (const bench of player.bench) {
                const benchPokemon = bench.getPokemonCard();
                if (benchPokemon) {
                    const matchesEvolution = benchPokemon.name === pokemonCard.evolvesFrom ||
                        benchPokemon.evolvesTo.includes(pokemonCard.name) ||
                        benchPokemon.evolvesToStage.includes(pokemonCard.stage) ||
                        (Array.isArray(benchPokemon.evolvesFromBase) && benchPokemon.evolvesFromBase.length > 0 && benchPokemon.evolvesFromBase.includes(pokemonCard.evolvesFrom));
                    if (matchesEvolution) {
                        // Check if Pokemon was played this turn (can't evolve if played this turn)
                        if (bench.pokemonPlayedTurn < state.turn) {
                            canEvolveBench = true;
                            break;
                        }
                    }
                }
            }
            if (!canEvolveActive && !canEvolveBench) {
                return false;
            }
        }
        // Basic validation passed
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.CAN_PLAY_POKEMON_CARD = CAN_PLAY_POKEMON_CARD;
/**
 * Universal function to check if any card can be played
 * @param store The store instance
 * @param state The current game state
 * @param player The player attempting to play the card
 * @param card The card to validate
 * @returns true if the card can be played, false otherwise
 */
function CAN_PLAY_CARD(store, state, player, card) {
    try {
        if (card instanceof __1.TrainerCard) {
            return CAN_PLAY_TRAINER_CARD(store, state, player, card);
        }
        else if (card instanceof __1.EnergyCard) {
            return CAN_PLAY_ENERGY_CARD(store, state, player, card);
        }
        else if (card instanceof pokemon_card_1.PokemonCard) {
            return CAN_PLAY_POKEMON_CARD(store, state, player, card);
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
exports.CAN_PLAY_CARD = CAN_PLAY_CARD;
/**
 * Creates and reduces a prevent retreat effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent the defending Pokemon from retreating.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
function BLOCK_RETREAT(store, state, effect, source) {
    const retreatEffect = (0, effect_of_attack_effects_1.preventRetreatEffect)(effect, source);
    return store.reduceEffect(state, retreatEffect);
}
exports.BLOCK_RETREAT = BLOCK_RETREAT;
/**
 * Creates and reduces a prevent damage effect for the given source card.
 * This is commonly used in Pokemon card effects that prevent damage during the opponent's next turn.
 * @param store The store instance
 * @param state The current game state
 * @param effect The original attack effect that triggered this
 * @param source The source card that created this effect
 * @returns The updated game state
 */
function PREVENT_DAMAGE(store, state, effect, source) {
    const damageEffect = (0, effect_of_attack_effects_1.preventDamageEffect)(effect, source);
    return store.reduceEffect(state, damageEffect);
}
exports.PREVENT_DAMAGE = PREVENT_DAMAGE;
/**
 * Checks if the a Pokemon is at full HP and that the damage dealt is enough to knock it out.
 * TODO: This doesn't work if the an attack changes the result of a CheckHpEffect (e.g. discards an hp-modifying stadium)
 */
function DAMAGED_FROM_FULL_HP(store, state, effect, player, target) {
    if (effect.target.damage != 0) {
        return false;
    }
    const checkHpEffect = new check_effects_1.CheckHpEffect(player, target);
    store.reduceEffect(state, checkHpEffect);
    return effect.damage >= checkHpEffect.hp;
}
exports.DAMAGED_FROM_FULL_HP = DAMAGED_FROM_FULL_HP;
/**
 * Compound helper for text like:
 * "If this Pokémon is in the Active Spot and is damaged by an opponent's attack
 * (even if this Pokémon is Knocked Out)..."
 */
function ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, options) {
    if (!(effect instanceof attack_effects_1.AfterDamageEffect)) {
        return false;
    }
    const { source, requireActiveSpot = true, requireAttackPhase = true } = options;
    if (effect.damage <= 0 || !effect.target.cards.includes(source)) {
        return false;
    }
    const targetOwner = __1.StateUtils.findOwner(state, effect.target);
    if (targetOwner === effect.player) {
        return false;
    }
    if (requireActiveSpot && targetOwner.active !== effect.target) {
        return false;
    }
    if (requireAttackPhase && state.phase !== state_1.GamePhase.ATTACK) {
        return false;
    }
    return true;
}
exports.ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT = ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT;
function isProtectionSourceInPlay(state, owner, source) {
    if (source === undefined) {
        return true;
    }
    if (source instanceof pokemon_card_1.PokemonCard) {
        let inPlay = false;
        owner.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
            if (pokemonCard === source) {
                inPlay = true;
            }
        });
        return inPlay;
    }
    if (source.trainerType === card_types_1.TrainerType.STADIUM) {
        return __1.StateUtils.getStadiumCard(state) === source;
    }
    if (source.trainerType === card_types_1.TrainerType.TOOL) {
        let attached = false;
        owner.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.tools.includes(source)) {
                attached = true;
            }
        });
        return attached;
    }
    return false;
}
function isBenchProtectionBlocked(store, state, owner, source, checkBlocked = true) {
    if (!checkBlocked || source === undefined) {
        return false;
    }
    if (source instanceof pokemon_card_1.PokemonCard) {
        return IS_ABILITY_BLOCKED(store, state, owner, source);
    }
    if (source.trainerType === card_types_1.TrainerType.TOOL) {
        return IS_TOOL_BLOCKED(store, state, owner, source);
    }
    return false;
}
function isProtectedBenchedTarget(state, effect, options) {
    const { owner, source, includeSourcePokemon = false, targetFilter } = options;
    if (!owner.bench.includes(effect.target)) {
        return false;
    }
    const attackerOwner = __1.StateUtils.findOwner(state, effect.source);
    if (attackerOwner === owner) {
        return false;
    }
    if (!includeSourcePokemon && source instanceof pokemon_card_1.PokemonCard && effect.target.cards.includes(source)) {
        return false;
    }
    const targetPokemon = effect.target.getPokemonCard();
    if (targetFilter && !targetFilter(effect.target, targetPokemon)) {
        return false;
    }
    return true;
}
/**
 * Compound helper for text like:
 * "Prevent all damage done to your other Benched Pokémon by attacks from your opponent's Pokémon."
 */
function PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, options) {
    if (!(effect instanceof attack_effects_1.PutDamageEffect) && !(effect instanceof attack_effects_1.PutCountersEffect)) {
        return;
    }
    if (!isProtectionSourceInPlay(state, options.owner, options.source)) {
        return;
    }
    if (isBenchProtectionBlocked(store, state, options.owner, options.source, options.checkBlocked)) {
        return;
    }
    if (!isProtectedBenchedTarget(state, effect, options)) {
        return;
    }
    effect.preventDefault = true;
}
exports.PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS = PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS;
/**
 * Compound helper for text like:
 * "Prevent all effects of attacks done to your other Benched Pokémon
 * by attacks from your opponent's Pokémon. (Damage is not an effect.)"
 */
function PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, options) {
    if (!(effect instanceof attack_effects_1.AbstractAttackEffect)) {
        return;
    }
    if (effect instanceof attack_effects_1.DealDamageEffect
        || effect instanceof attack_effects_1.PutDamageEffect
        || effect instanceof attack_effects_1.PutCountersEffect
        || effect instanceof attack_effects_1.ApplyWeaknessEffect
        || effect instanceof attack_effects_1.AfterDamageEffect) {
        return;
    }
    if (!isProtectionSourceInPlay(state, options.owner, options.source)) {
        return;
    }
    if (isBenchProtectionBlocked(store, state, options.owner, options.source, options.checkBlocked)) {
        return;
    }
    if (!isProtectedBenchedTarget(state, effect, options)) {
        return;
    }
    effect.preventDefault = true;
}
exports.PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS = PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS;
/**
 * Compound helper for text like:
 * "If this Pokemon has full HP and would be Knocked Out by damage from an attack,
 * this Pokemon is not Knocked Out and its remaining HP becomes 10 instead."
 */
function SURVIVE_ON_TEN_IF_FULL_HP(store, state, effect, options) {
    if (!(effect instanceof attack_effects_1.PutDamageEffect)) {
        return;
    }
    const { reason, source, checkBlocked = true } = options;
    const player = __1.StateUtils.findOwner(state, effect.target);
    if (source instanceof pokemon_card_1.PokemonCard) {
        if (!effect.target.cards.includes(source)) {
            return;
        }
        if (checkBlocked && IS_ABILITY_BLOCKED(store, state, player, source)) {
            return;
        }
    }
    else if (source instanceof __1.TrainerCard) {
        if (!effect.target.tools.includes(source)) {
            return;
        }
        if (checkBlocked && IS_TOOL_BLOCKED(store, state, player, source)) {
            return;
        }
    }
    else {
        return;
    }
    if (DAMAGED_FROM_FULL_HP(store, state, effect, player, effect.target)) {
        effect.surviveOnTenHPReason = reason;
    }
}
exports.SURVIVE_ON_TEN_IF_FULL_HP = SURVIVE_ON_TEN_IF_FULL_HP;
/**
 * Tera Rule: Prevents damage effects from being applied to non-active Pokémon.
 * This is commonly used by Tera Pokémon to prevent damage to benched Pokémon.
 * @param effect The effect being processed
 * @param state The current game state
 * @param source The source card that created this effect
 */
function TERA_RULE(effect, state, source) {
    if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(source) && effect.target.getPokemonCard() === source) {
        const player = effect.player;
        const opponent = __1.StateUtils.getOpponent(state, player);
        // Target is not Active
        if (effect.target === player.active || effect.target === opponent.active) {
            return;
        }
        effect.preventDefault = true;
    }
}
exports.TERA_RULE = TERA_RULE;
