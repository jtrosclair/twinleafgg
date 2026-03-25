"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelMax = void 0;
const card_manager_1 = require("../../game/cards/card-manager");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find Level X Pokemon that can evolve from Pokemon in play
    const cm = card_manager_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.LV_X;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Flip a coin - the effect only works on heads
    let coinFlipResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        coinFlipResult = result;
        next();
    });
    // If tails, discard the card and do nothing
    if (!coinFlipResult) {
        return state;
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    // Block any card that is not a Level X Pokemon, or is a Level X but not in the valid evolution names
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof pokemon_card_1.PokemonCard)) {
            // Block non-Pokemon cards
            blocked.push(index);
        }
        else if (card.stage !== card_types_1.Stage.LV_X) {
            // Block Pokemon cards that are not Level X
            blocked.push(index);
        }
        else if (!evolutionNames.includes(card.name)) {
            // Block Level X Pokemon that are not valid evolutions
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.LV_X }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        return state; // canceled by user
    }
    const evolution = cards[0];
    const blocked2 = [];
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.name !== evolution.evolvesFrom) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
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
    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class LevelMax extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PL';
        this.name = 'Level Max';
        this.fullName = 'Level Max PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.text = 'Flip a coin. If heads, search your deck for a Pokémon LV.X that levels up from 1 of your Pokémon, and put it onto that Pokémon. (This counts as leveling up that Pokémon.) Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LevelMax = LevelMax;
