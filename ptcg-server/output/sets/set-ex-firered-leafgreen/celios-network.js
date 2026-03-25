"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CeliosNetwork = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class CeliosNetwork extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Celio\'s Network';
        this.fullName = 'Celio\'s Network RG';
        this.text = 'Search your deck for a Basic Pokémon or Evolution card (excluding Pokémon-ex), show it to your opponent, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, {}, { min: 0, max: 1, blocked });
            return state;
        }
        return state;
    }
}
exports.CeliosNetwork = CeliosNetwork;
