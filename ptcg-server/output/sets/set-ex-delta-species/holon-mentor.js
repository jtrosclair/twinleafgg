"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonMentor = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class HolonMentor extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Holon Mentor';
        this.fullName = 'Holon Mentor DS';
        this.text = 'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nSearch your deck for up to 3 Basic Pokémon that each has 100 HP or less, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 1);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = player.deck.cards.reduce((acc, c, index) => {
                if (!(c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC && c.hp <= 100)) {
                    acc.push(index);
                }
                return acc;
            }, []);
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 3, allowCancel: false, blocked });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.HolonMentor = HolonMentor;
