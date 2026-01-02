"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryGarden = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    if (player.hand.cards.every(c => c.superType !== game_1.SuperType.ENERGY)) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cards, player.discard);
    let psychicPokemon = 0;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card instanceof game_1.PokemonCard && card.cardType === game_1.CardType.PSYCHIC) {
            psychicPokemon++;
        }
    });
    const cardsToDraw = psychicPokemon - player.hand.cards.length;
    if (cardsToDraw > 0) {
        player.deck.moveTo(player.hand, cardsToDraw);
    }
    return state;
}
class MysteryGarden extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.STADIUM;
        this.set = 'MEG';
        this.regulationMark = 'I';
        this.setNumber = '122';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mystery Garden';
        this.fullName = 'Mystery Garden M1S';
        this.text = 'Once during each player\'s turn, that player may discard 1 Energy card from their hand. If they do, that player draws cards until they have as many cards in hand as they have Psychic Pokémon in play.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MysteryGarden = MysteryGarden;
