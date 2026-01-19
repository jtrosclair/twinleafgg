"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useCellularAwakening(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
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
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 5, allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    for (const target of targets) {
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            return state; // invalid target?
        }
        // Blocking pokemon cards, that cannot be valid evolutions
        const blocked = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== pokemonCard.name) {
                blocked.push(index);
            }
        });
        let cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
            cards = selected || [];
            next();
        });
        // Canceled by user, he didn't found the card in the deck
        if (cards.length === 0) {
            continue;
        }
        const evolution = cards[0];
        // Evolve Pokemon
        player.deck.moveCardTo(evolution, target);
        target.clearEffects();
        target.pokemonPlayedTurn = state.turn;
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cellular Awakening',
                cost: [C],
                damage: 0,
                text: 'For each of your Benched Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            },
            {
                name: 'Evo Lariat',
                cost: [C],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each of your Evolution Pokémon in play.'
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus SV11B';
    }
    reduceEffect(store, state, effect) {
        // Cellular Awakening
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useCellularAwakening(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Evo Lariat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let evolutions = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a, _b, _c, _d;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) !== card_types_1.Stage.BASIC
                    && ((_b = card.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) !== card_types_1.Stage.LEGEND
                    && ((_c = card.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.stage) !== card_types_1.Stage.VUNION
                    && ((_d = card.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.stage) !== card_types_1.Stage.RESTORED) {
                    evolutions++;
                }
            });
            effect.damage += evolutions * 40;
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
