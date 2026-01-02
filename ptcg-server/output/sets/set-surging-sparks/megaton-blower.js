"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegatonBlower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegatonBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '182';
        this.regulationMark = 'H';
        this.name = 'Megaton Blower';
        this.fullName = 'Megaton Blower SSP';
        this.text = 'Discard all Pokémon Tools and Special Energy from all of your opponent\'s Pokémon, and discard a Stadium in play.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            // Handle stadium discard if one is in play
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                if (cardList) {
                    const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
                    state = prefabs_1.MOVE_CARDS(store, state, cardList, stadiumOwner.discard, { cards: [stadiumCard], sourceCard: this });
                }
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Function to discard special energy and tools from a PokemonCardList
            const discardSpecialEnergyAndTools = (pokemonCardList) => {
                const cardsToDiscard = pokemonCardList.cards.filter(card => (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.SPECIAL) ||
                    (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL));
                if (cardsToDiscard.length > 0) {
                    state = prefabs_1.MOVE_CARDS(store, state, pokemonCardList, opponent.discard, { cards: cardsToDiscard });
                }
            };
            // Discard from active Pokémon
            discardSpecialEnergyAndTools(opponent.active);
            // Discard from bench Pokémon
            opponent.bench.forEach(benchPokemon => {
                discardSpecialEnergyAndTools(benchPokemon);
            });
            // Move this card to discard pile
            state = prefabs_1.MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this] });
        }
        return state;
    }
}
exports.MegatonBlower = MegatonBlower;
