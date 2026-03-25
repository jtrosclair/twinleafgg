"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flannery = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect, trainerCard) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let hasPokemonWithEnergy = false;
    const blocked = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.energies.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.SPECIAL)) {
            hasPokemonWithEnergy = true;
        }
        else {
            blocked.push(target);
        }
    });
    const stadiumCard = game_1.StateUtils.getStadiumCard(state);
    if (!hasPokemonWithEnergy && stadiumCard === undefined) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (!hasPokemonWithEnergy && stadiumCard !== undefined) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (hasPokemonWithEnergy && stadiumCard === undefined) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const cardList = targets[0];
    if (cardList.isStage(card_types_1.Stage.BASIC)) {
        try {
            const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
        }
        catch (_a) {
            return state;
        }
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // Discard trainer only when user selected a Pokemon
        // Discard selected special energy card
        (0, prefabs_1.MOVE_CARDS)(store, state, target, opponent.discard, { cards, sourceCard: trainerCard });
    }
    if (stadiumCard !== undefined) {
        // Discard Stadium
        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
        const playerStadium = game_1.StateUtils.findOwner(state, cardList);
        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, playerStadium.discard, { sourceCard: trainerCard });
        return state;
    }
}
class Flannery extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Flannery';
        this.fullName = 'Flannery CRE';
        this.text = 'Discard a Special Energy attached to 1 of your opponent\'s Pokémon, and discard a Stadium in play.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.Flannery = Flannery;
