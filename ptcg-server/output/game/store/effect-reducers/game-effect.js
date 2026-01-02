"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameReducer = void 0;
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const coin_flip_prompt_1 = require("../prompts/coin-flip-prompt");
const state_utils_1 = require("../state-utils");
const state_1 = require("../state/state");
const game_effects_2 = require("../effects/game-effects");
const game_stats_tracker_1 = require("../game-stats-tracker");
const pokemon_card_list_1 = require("../state/pokemon-card-list");
const prefabs_1 = require("../prefabs/prefabs");
const card_list_1 = require("../state/card-list");
const marker_constants_1 = require("../markers/marker-constants");
const confirm_prompt_1 = require("../prompts/confirm-prompt");
const check_effect_1 = require("./check-effect");
const choose_attack_prompt_1 = require("../prompts/choose-attack-prompt");
const wait_prompt_1 = require("../prompts/wait-prompt");
const play_card_effects_1 = require("../effects/play-card-effects");
function applyWeaknessAndResistance(damage, cardTypes, additionalCardTypes, weakness, resistance) {
    let multiply = 1;
    let modifier = 0;
    const allTypes = [...cardTypes, ...additionalCardTypes];
    for (const item of weakness) {
        if (allTypes.includes(item.type)) {
            if (item.value === undefined) {
                multiply *= 2;
            }
            else {
                modifier += item.value;
            }
        }
    }
    for (const item of resistance) {
        if (allTypes.includes(item.type)) {
            modifier += item.value;
        }
    }
    return (damage * multiply) + modifier;
}
function* useAttack(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    //Skip attack on first turn
    if (state.turn === 1 && effect.attack.canUseOnFirstTurn !== true && state.rules.attackFirstTurn == false) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
    }
    const sp = player.active.specialConditions;
    if (sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
    }
    const attack = effect.attack;
    let attackingPokemon = player.active;
    // Check for attacks that can be used from bench
    player.bench.forEach(benchSlot => {
        const benchPokemon = benchSlot.getPokemonCard();
        if (benchPokemon && benchPokemon.attacks.some(a => a.name === attack.name && a.useOnBench)) {
            attackingPokemon = benchSlot;
        }
    });
    // Check if Pokemon cannot attack next turn
    if (attackingPokemon.cannotAttackNextTurn) {
        throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
    }
    // Check if specific attack cannot be used next turn
    if (attackingPokemon.cannotUseAttacksNextTurn.includes(attack.name)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
    }
    // Get the actual PokemonCard for power checks
    const attackingPokemonCard = attackingPokemon.getPokemonCard();
    // Check for barrage on powers (and not blocked)
    let hasBarragePower = false;
    if (attackingPokemonCard) {
        hasBarragePower = attackingPokemonCard.powers.some(power => power.barrage);
    }
    const checkAttackCost = new check_effects_1.CheckAttackCostEffect(player, attack);
    state = store.reduceEffect(state, checkAttackCost);
    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, attackingPokemon);
    state = store.reduceEffect(state, checkProvidedEnergy);
    if (state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
        throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
    }
    if (sp.includes(card_types_1.SpecialCondition.CONFUSED)) {
        let flip = false;
        store.log(state, game_message_1.GameLog.LOG_FLIP_CONFUSION, { name: player.name });
        yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.FLIP_CONFUSION), result => {
            flip = result;
            next();
        });
        if (flip === false) {
            store.log(state, game_message_1.GameLog.LOG_HURTS_ITSELF);
            player.active.damage += 30;
            state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
            return state;
        }
    }
    store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
    state.phase = state_1.GamePhase.ATTACK;
    // At the start of the attack, initialize pendingAttackTargets
    //  (attackingPokemon as any).pendingAttackTargets = [];
    const attackEffect = (effect instanceof game_effects_1.AttackEffect) ? effect : new game_effects_1.AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    // --- Attack Animation Trigger ---
    // Set triggerAttackAnimation on the attacking Pokemon
    attackingPokemon.triggerAttackAnimation = true;
    // Find slot and index for the attackingPokemon
    let slot = undefined;
    let index = undefined;
    if (player.active === attackingPokemon) {
        slot = 'active';
        index = 0;
    }
    else {
        slot = 'bench';
        index = player.bench.indexOf(attackingPokemon);
    }
    const card = attackingPokemon.getPokemonCard();
    const cardId = card ? card.id : undefined;
    // Emit attack animation event
    const game = store.handler;
    if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c) => {
            if (typeof c.socket !== 'undefined') {
                c.socket.emit(`game[${game.id}]:attack`, {
                    playerId: player.id,
                    cardId,
                    slot,
                    index
                });
            }
        });
    }
    // Yield a wait prompt for the animation (1 second)
    yield store.prompt(state, new wait_prompt_1.WaitPrompt(player.id, 1000, 'Attack animation'), () => {
        // After wait, clear the animation flag
        attackingPokemon.triggerAttackAnimation = false;
        next();
    });
    // --- End Attack Animation Trigger ---
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    const afterAttackEffect = new game_phase_effects_1.AfterAttackEffect(effect.player, opponent, attack);
    state = store.reduceEffect(state, afterAttackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if ((attack.barrage || hasBarragePower) && !effect._barrageUsed) {
        state = check_effect_1.checkState(store, state);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
        state = check_effect_1.checkState(store, state);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
        let wantToUse = undefined;
        yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), result => {
            wantToUse = result;
            next();
        });
        if (wantToUse) {
            // If barrage is from a power, prompt for attack choice
            if (!attack.barrage && hasBarragePower) {
                // Gather all attackable cards: the actual Pokemon and any attached tool with attacks
                const attackableCards = [];
                const mainPokemon = attackingPokemon.getPokemonCard();
                if (mainPokemon) {
                    attackableCards.push(mainPokemon);
                }
                if (attackingPokemon.tools.length > 0) {
                    attackableCards.push(attackingPokemon.tools[0]);
                }
                yield store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, attackableCards, { allowCancel: false }), (selectedAttack) => {
                    if (selectedAttack) {
                        const newEffect = new game_effects_1.AttackEffect(player, opponent, selectedAttack);
                        newEffect._barrageUsed = true;
                        const generator = useAttack(() => generator.next(), store, state, newEffect);
                        state = generator.next().value;
                    }
                    else {
                        state = store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
                    }
                    next();
                });
                return state;
            }
            else {
                // Default: use the same attack again
                const newEffect = new game_effects_1.UseAttackEffect(player, attack);
                newEffect._barrageUsed = true;
                const generator = useAttack(() => generator.next(), store, state, newEffect);
                return generator.next().value;
            }
        }
        return store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
    }
    return store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
}
function gameReducer(store, state, effect) {
    if (effect instanceof game_effects_1.KnockOutEffect) {
        const card = effect.target.getPokemonCard();
        if (card !== undefined) {
            // Pokemon ex rule
            if (card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_ex) || card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                effect.prizeCount += 1;
            }
            if (card.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) || card.tags.includes(card_types_1.CardTag.TAG_TEAM) || card.tags.includes(card_types_1.CardTag.DUAL_LEGEND)) {
                effect.prizeCount += 1;
            }
            if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || card.tags.includes(card_types_1.CardTag.POKEMON_VUNION)) {
                effect.prizeCount += 2;
            }
            store.log(state, game_message_1.GameLog.LOG_POKEMON_KO, { name: card.name });
            // Centralized revenge attack detection: if Pokémon was knocked out during opponent's attack
            // effect.player is the owner of the knocked out Pokémon
            const knockedOutOwner = effect.player;
            const attacker = state_utils_1.StateUtils.getOpponent(state, knockedOutOwner);
            // Check if knockout occurred during opponent's attack phase and damage was dealt
            // The DAMAGE_DEALT_MARKER is set on the player who received damage (knockedOutOwner)
            if (state.phase === state_1.GamePhase.ATTACK &&
                state.players[state.activePlayer] === attacker &&
                knockedOutOwner.marker.hasMarker(knockedOutOwner.DAMAGE_DEALT_MARKER)) {
                knockedOutOwner.marker.addMarkerToState(marker_constants_1.MarkerConstants.REVENGE_MARKER);
            }
            // Handle Lost City marker or PRISM_STAR cards
            if (effect.target.marker.hasMarker('LOST_CITY_MARKER') || card.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                const lostZoned = new card_list_1.CardList();
                const attachedCards = new card_list_1.CardList();
                const tools = [...effect.target.tools];
                const pokemonIndices = effect.target.cards.map((card, index) => index);
                // Move tools to discard BEFORE clearing effects (directly)
                for (const tool of tools) {
                    effect.target.moveCardTo(tool, effect.player.discard);
                }
                // Clear damage and effects
                effect.target.damage = 0;
                effect.target.clearEffects();
                for (let i = pokemonIndices.length - 1; i >= 0; i--) {
                    const removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];
                    // Handle cardlist cards (energy, tools, etc.)
                    if (removedCard.cards) {
                        const cards = removedCard.cards;
                        while (cards.cards.length > 0) {
                            const card = cards.cards[0];
                            attachedCards.cards.push(card);
                            cards.cards.splice(0, 1);
                        }
                    }
                    // Handle the main card
                    if (removedCard.superType === card_types_1.SuperType.POKEMON || removedCard.stage === card_types_1.Stage.BASIC || removedCard.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                        lostZoned.cards.push(removedCard);
                    }
                    else {
                        attachedCards.cards.push(removedCard);
                    }
                }
                // Move attached cards to discard
                if (attachedCards.cards.length > 0) {
                    state = prefabs_1.MOVE_CARDS(store, state, attachedCards, effect.player.discard);
                }
                // Move Pokémon to lost zone
                if (lostZoned.cards.length > 0) {
                    state = prefabs_1.MOVE_CARDS(store, state, lostZoned, effect.player.lostzone);
                }
            }
            else {
                // Default behavior - move to discard
                const tools = [...effect.target.tools];
                // Move tools to discard BEFORE clearing effects (directly)
                for (const tool of tools) {
                    effect.target.moveCardTo(tool, effect.player.discard);
                }
                effect.target.clearEffects();
                state = prefabs_1.MOVE_CARDS(store, state, effect.target, effect.player.discard);
            }
        }
    }
    if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
        const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
        state = store.reduceEffect(state, checkPokemonType);
        const checkPokemonStats = new check_effects_1.CheckPokemonStatsEffect(effect.target);
        state = store.reduceEffect(state, checkPokemonStats);
        const cardType = checkPokemonType.cardTypes;
        const additionalCardTypes = checkPokemonType.cardTypes;
        const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
        const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
        effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes, weakness, resistance);
        return state;
    }
    if (effect instanceof game_effects_1.UseAttackEffect) {
        const generator = useAttack(() => generator.next(), store, state, effect);
        return generator.next().value;
    }
    if (effect instanceof game_effects_1.UsePowerEffect) {
        const player = effect.player;
        const power = effect.power;
        const card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.PowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof game_effects_1.UseTrainerPowerEffect) {
        const player = effect.player;
        const power = effect.power;
        const card = effect.card;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
        state = store.reduceEffect(state, new game_effects_1.TrainerPowerEffect(player, power, card));
        return state;
    }
    if (effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
        const target = effect.target;
        effect.specialConditions.forEach(sp => {
            target.addSpecialCondition(sp);
        });
        if (effect.poisonDamage !== undefined) {
            target.poisonDamage = effect.poisonDamage;
        }
        if (effect.burnDamage !== undefined) {
            target.burnDamage = effect.burnDamage;
        }
        if (effect.sleepFlips !== undefined) {
            target.sleepFlips = effect.sleepFlips;
        }
        return state;
    }
    if (effect instanceof game_effects_1.UseStadiumEffect) {
        const player = effect.player;
        store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
        player.stadiumUsedTurn = state.turn;
    }
    // if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
    //   const player = effect.player;
    //   store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
    // }
    if (effect instanceof game_effects_1.HealEffect) {
        effect.target.damage = Math.max(0, effect.target.damage - effect.damage);
        return state;
    }
    if (effect instanceof game_effects_1.PutDamageCountersEffect) {
        // First process the EffectOfAbilityEffect
        state = store.reduceEffect(state, effect.effectOfAbility);
        // Then apply the damage if the effect wasn't prevented
        if (effect.effectOfAbility.target) {
            const damage = Math.max(0, effect.damage);
            effect.effectOfAbility.target.damage += damage;
            if (damage > 0) {
                const targetCard = effect.effectOfAbility.target.getPokemonCard();
                if (targetCard) {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
                        name: effect.player.name,
                        damage: damage,
                        target: targetCard.name,
                        effect: effect.power.name,
                    });
                }
            }
        }
        return state;
    }
    if (effect instanceof game_effects_1.EvolveEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        // Track Pokemon evolution for damage continuity
        game_stats_tracker_1.GameStatsTracker.handlePokemonEvolution(effect.player, effect.target, pokemonCard, effect.pokemonCard);
        store.log(state, game_message_1.GameLog.LOG_PLAYER_EVOLVES_POKEMON, {
            name: effect.player.name,
            pokemon: pokemonCard.name,
            card: effect.pokemonCard.name
        });
        effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
        effect.target.pokemonPlayedTurn = state.turn;
        // effect.target.clearEffects();
        // Apply the removePokemonEffects method from the Player class
        // effect.player.removePokemonEffects(effect.target);
        effect.target.specialConditions = [];
        effect.target.marker.markers = [];
    }
    if (effect instanceof game_effects_2.MoveCardsEffect) {
        const source = effect.source;
        const destination = effect.destination;
        // If source is a PokemonCardList, always clean up when moving cards
        if (source instanceof pokemon_card_list_1.PokemonCardList) {
            source.clearEffects();
            source.damage = 0;
            source.specialConditions = [];
            source.marker.markers = [];
            source.tools = [];
            source.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
        // Helper to get owner of a CardList
        const getOwner = (cardList) => {
            try {
                return state_utils_1.StateUtils.findOwner(state, cardList);
            }
            catch (_a) {
                return undefined;
            }
        };
        // Helper to check if a CardList is a player's discard
        const isDiscardPile = (cardList) => {
            const owner = getOwner(cardList);
            return owner && owner.discard === cardList;
        };
        // Move logic for Prism Star cards
        const moveWithPrismStarCheck = (cardsToMove, src, dest) => {
            if (isDiscardPile(dest)) {
                const owner = getOwner(dest);
                const toLostZone = cardsToMove.filter(card => card.tags && card.tags.includes(card_types_1.CardTag.PRISM_STAR));
                const toDiscard = cardsToMove.filter(card => !(card.tags && card.tags.includes(card_types_1.CardTag.PRISM_STAR)));
                if (toLostZone.length > 0 && owner) {
                    src.moveCardsTo(toLostZone, owner.lostzone);
                }
                if (toDiscard.length > 0) {
                    src.moveCardsTo(toDiscard, dest);
                }
            }
            else {
                src.moveCardsTo(cardsToMove, dest);
            }
        };
        // If specific cards are specified
        if (effect.cards) {
            moveWithPrismStarCheck(effect.cards, source, destination);
            if (effect.toBottom) {
                destination.cards = [...destination.cards.slice(effect.cards.length), ...effect.cards];
            }
            else if (effect.toTop) {
                destination.cards = [...effect.cards, ...destination.cards];
            }
        }
        // If count is specified
        else if (effect.count !== undefined) {
            const cards = source.cards.slice(0, effect.count);
            moveWithPrismStarCheck(cards, source, destination);
            if (effect.toBottom) {
                destination.cards = [...destination.cards.slice(cards.length), ...cards];
            }
            else if (effect.toTop) {
                destination.cards = [...cards, ...destination.cards];
            }
        }
        // Move all cards
        else {
            // For move all, check for Prism Star cards
            if (isDiscardPile(destination)) {
                const owner = getOwner(destination);
                const toLostZone = source.cards.filter(card => card.tags && card.tags.includes(card_types_1.CardTag.PRISM_STAR));
                const toDiscard = source.cards.filter(card => !(card.tags && card.tags.includes(card_types_1.CardTag.PRISM_STAR)));
                if (toLostZone.length > 0 && owner) {
                    source.moveCardsTo(toLostZone, owner.lostzone);
                }
                if (toDiscard.length > 0) {
                    source.moveCardsTo(toDiscard, destination);
                }
            }
            else {
                if (effect.toTop) {
                    source.moveToTopOfDestination(destination);
                }
                else {
                    source.moveTo(destination);
                }
            }
        }
        // If source is a PokemonCardList and we moved all cards, discard remaining attached cards
        if (source instanceof pokemon_card_list_1.PokemonCardList && source.getPokemons().length === 0) {
            const player = state_utils_1.StateUtils.findOwner(state, source);
            source.moveTo(player.discard);
        }
        return state;
    }
    if (effect instanceof play_card_effects_1.CoinFlipEffect) {
        // Simulate coin flip and store result
        const result = Math.random() < 0.5;
        effect.result = result;
        // Log the coin flip result
        const gameMessage = result ? game_message_1.GameLog.LOG_PLAYER_FLIPS_HEADS : game_message_1.GameLog.LOG_PLAYER_FLIPS_TAILS;
        store.log(state, gameMessage, { name: effect.player.name });
        // Call callback if provided
        if (effect.callback) {
            effect.callback(result);
        }
        return state;
    }
    return state;
}
exports.gameReducer = gameReducer;
