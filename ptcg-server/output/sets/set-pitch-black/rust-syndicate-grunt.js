"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustSyndicateGrunt = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RustSyndicateGrunt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M5';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rust Syndicate Grunt';
        this.fullName = 'Rust Syndicate Grunt M5';
        this.text = `You may only play this card if 1 of your Pokémon was Knocked Out during your opponent\'s last turn.\n\nDiscard 1 Energy attached to 1 of your opponent\'s Pokémon.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            return playRust(store, state, effect, this);
        }
        return state;
    }
}
exports.RustSyndicateGrunt = RustSyndicateGrunt;
function playRust(store, state, effect, _self) {
    const player = effect.player;
    if (player.supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const otherCards = player.hand.cards.filter(c => c !== effect.trainerCard);
    if (otherCards.length > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (!player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const blocked = [];
    let anyEnergy = false;
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
        if (cardList.energies.cards.length > 0) {
            anyEnergy = true;
        }
    });
    if (!anyEnergy) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.energies.cards.length === 0) {
            blocked.push(target);
        }
    });
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), targets => {
        const tgt = targets && targets[0];
        if (!tgt) {
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(store, effect, player);
            return state;
        }
        return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, tgt.energies, {}, { min: 1, max: 1, allowCancel: false }), sel => {
            tgt.moveCardsTo(sel || [], opponent.discard);
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(store, effect, player);
            return state;
        });
    });
}
