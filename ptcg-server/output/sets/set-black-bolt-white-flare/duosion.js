"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duosion = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCellularEvolution(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof game_1.PokemonCard && c.stage !== game_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        return state;
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard && !evolutionNames.includes(card.name)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        return state; // canceled by user
    }
    const evolution = cards[0];
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.name !== evolution.evolvesFrom || list.pokemonPlayedTurn === state.turn) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        prefabs_1.SHUFFLE_DECK(store, state, player);
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
    prefabs_1.SHUFFLE_DECK(store, state, player);
}
class Duosion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Solosis';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Cellular Evolution',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a card that evolves from 1 of your Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            },
            {
                name: 'Spray Fluid',
                cost: [C],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Duosion';
        this.fullName = 'Duosion SV11B';
    }
    reduceEffect(store, state, effect) {
        // Cellular Evolution
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const generator = useCellularEvolution(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Duosion = Duosion;
