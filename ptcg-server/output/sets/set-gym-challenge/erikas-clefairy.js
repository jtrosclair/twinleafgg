"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErikasClefairy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list === player.active) {
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
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
    }
    let flipResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (!flipResult) {
        return state;
    }
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && !evolutionNames.includes(card.name)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Canceled by user, he didn't found the card in the deck
    if (cards.length === 0) {
        return state;
    }
    const evolution = cards[0];
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.name !== evolution.evolvesFrom) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    const pokemonCard = targets[0].getPokemonCard();
    if (pokemonCard === undefined) {
        return state; // invalid target?
    }
    // Evolve Pokemon
    player.deck.moveCardTo(evolution, targets[0]);
    targets[0].clearEffects();
    targets[0].pokemonPlayedTurn = state.turn;
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class ErikasClefairy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ERIKAS];
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Lunar Power',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a card that evolves from 1 of your Benched Pokémon and put that card on that Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward.'
            },
            {
                name: 'Moon Kick',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Erika\'s Clefairy';
        this.fullName = 'Erika\'s Clefairy G2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ErikasClefairy = ErikasClefairy;
