"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RareCandy = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_manager_1 = require("../../game/cards/card-manager");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
function isMatchingStage2(stage1, basic, stage2) {
    for (const card of stage1) {
        if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
            return true;
        }
    }
    return false;
}
function* playCardRspk(next, store, state, effect) {
    const player = effect.player;
    // Create list of non - Pokemon SP slots
    const blocked = [];
    let hasBasicPokemon = false;
    const stage2 = player.hand.cards.filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2;
    });
    const stage1 = player.hand.cards.filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
    });
    if (stage2.length === 0 && stage1.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if it's a valid Stage 2
    const cm = card_manager_1.CardManager.getInstance();
    const stage1Ref = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
    });
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (l, card, target) => {
        if (card.stage === card_types_1.Stage.BASIC && stage2.some(s => isMatchingStage2(stage1Ref, card, s))) {
            hasBasicPokemon = true;
            return;
        }
        if (card.stage === card_types_1.Stage.BASIC && stage1.some(s => s.evolvesFrom === card.name)) {
            hasBasicPokemon = true;
            return;
        }
        blocked.push(target);
    });
    if (!hasBasicPokemon) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: true, blocked }), selection => {
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
    // Block all cards in hand that are not valid evolutions for the selected Basic
    const blocked2 = [];
    player.hand.cards.forEach((c, index) => {
        if (!(c instanceof pokemon_card_1.PokemonCard)) {
            blocked2.push(index);
            return;
        }
        if (c.stage === card_types_1.Stage.STAGE_1) {
            if (c.evolvesFrom !== pokemonCard.name) {
                blocked2.push(index);
                return;
            }
        }
        else if (c.stage === card_types_1.Stage.STAGE_2) {
            // Only allow Stage 2 that matches the selected Basic via a Stage 1
            if (!isMatchingStage2(stage1Ref, pokemonCard, c)) {
                blocked2.push(index);
                return;
            }
        }
        else {
            // Not a Stage 1 or Stage 2
            blocked2.push(index);
            return;
        }
    });
    let cards = [];
    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked: blocked2 }), selected => {
        cards = selected || [];
        if (cards.length > 0) {
            const pokemonCard = cards[0];
            const evolveEffect = new game_effects_1.EvolveEffect(player, targets[0], pokemonCard);
            store.reduceEffect(state, evolveEffect);
            // Discard trainer only when user selected a Pokemon
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
    });
}
class RareCandy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Rare Candy';
        this.fullName = 'Rare Candy HP';
        this.text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 1 or Stage 2 card that evolves from that Pokémon in your hand, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCardRspk(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RareCandy = RareCandy;
