"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonResearcher = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class HolonResearcher extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Holon Researcher';
        this.fullName = 'Holon Researcher DS';
        this.text = `Discard a card from your hand. If you can't discard a card from your hand, you can't play this card.
    
Search your deck for a [M] Energy card or a Basic Pokémon (or Evolution card) that has delta on its card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 1, 1);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    return;
                }
                else if (c.superType === card_types_1.SuperType.ENERGY && c.name === 'Metal Energy') {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.MOVE_CARDS_TO_HAND)(store, state, player, cards);
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
            return state;
        }
        return state;
    }
}
exports.HolonResearcher = HolonResearcher;
