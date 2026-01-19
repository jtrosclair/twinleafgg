"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowletAlolanExeggutorGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useSuperGrowth(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof game_1.PokemonCard && c.stage !== game_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, list);
        store.reduceEffect(state, playedTurnEffect);
        if (card.stage !== game_1.Stage.BASIC || card.cardType !== game_1.CardType.GRASS || playedTurnEffect.pokemonPlayedTurn === state.turn) {
            return;
        }
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage !== game_1.Stage.BASIC) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        return state; // canceled by user
    }
    const target = targets[0];
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
        return state; // invalid target?
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard && card.evolvesFrom !== pokemonCard.name) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.STAGE_1, evolvesFrom: pokemonCard.name }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Canceled by user, he didn't find the card in the deck
    if (cards.length === 0) {
        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        return state;
    }
    const evolution = cards[0];
    // Evolve Pokemon
    player.deck.moveCardTo(evolution, target);
    target.clearEffects();
    target.pokemonPlayedTurn = state.turn;
    // Check if there's a Stage 2 evolution available
    const stage2Evolutions = evolutions.filter(e => e.evolvesFrom === evolution.name);
    if (stage2Evolutions.length > 0) {
        // Blocking pokemon cards, that cannot be valid evolutions
        const blockedStage2 = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof game_1.PokemonCard && card.evolvesFrom !== evolution.name) {
                blockedStage2.push(index);
            }
        });
        let stage2Cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.STAGE_2, evolvesFrom: evolution.name }, { min: 1, max: 1, allowCancel: true, blocked: blockedStage2 }), selected => {
            stage2Cards = selected || [];
            next();
        });
        if (stage2Cards.length > 0) {
            const stage2Evolution = stage2Cards[0];
            player.deck.moveCardTo(stage2Evolution, target);
            target.clearEffects();
            target.pokemonPlayedTurn = state.turn;
        }
    }
    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class RowletAlolanExeggutorGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 270;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Suepr Growth',
                cost: [],
                damage: 0,
                text: 'Search your deck for a card that evolves from 1 of your [G] Pokémon and put it onto that Pokémon to evolve it. If that Pokémon is now a Stage 1 Pokémon, search your deck for a Stage 2 Pokémon that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck. '
            },
            {
                name: 'Calming Hurricane',
                cost: [G, G, C],
                damage: 150,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Tropical Hour-GX',
                cost: [G, G, G],
                damage: 200,
                gxAttack: true,
                text: 'If this Pokémon has at least 3 extra Energy attached to it (in addition to this attack\'s cost), your opponent shuffles all Energy from all of their Pokémon into their deck. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rowlet & Alolan Exeggutor-GX';
        this.fullName = 'Rowlet & Alolan Exeggutor-GX UNM';
    }
    reduceEffect(store, state, effect) {
        // Super Growth
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useSuperGrowth(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Calming Hurricane
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const healing = new game_effects_1.HealEffect(effect.player, effect.player.active, 30);
            store.reduceEffect(state, healing);
        }
        // Tropical Hour-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            const extraEffectCost = [G, G, G, G, G, G];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                    const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, card);
                    state = store.reduceEffect(state, opponentEnergy);
                    opponentEnergy.energyMap.forEach(em => {
                        em.card.cards.moveTo(opponent.deck);
                    });
                });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            }
        }
        return state;
    }
}
exports.RowletAlolanExeggutorGX = RowletAlolanExeggutorGX;
