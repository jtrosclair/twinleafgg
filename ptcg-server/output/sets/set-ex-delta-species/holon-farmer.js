"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonFarmer = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class HolonFarmer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Holon Farmer';
        this.fullName = 'Holon Farmer DS';
        this.text = 'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nSearch your discard pile for 3 basic Energy cards and any combination of 3 Basic Pokémon or Evolution cards, show them to your opponent, and put them on top of your deck. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 1, 1);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            let pokemons = 0;
            let energies = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    energies += 1;
                }
                else if (c instanceof game_1.PokemonCard) {
                    pokemons += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            const maxPokemons = Math.min(pokemons, 3);
            const maxEnergies = Math.min(energies, 3);
            const count = maxPokemons + maxEnergies;
            if (count === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: count, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
                cards = selected || [];
                (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: cards, sourceCard: this });
                if (cards.length > 0) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            });
        }
        return state;
    }
}
exports.HolonFarmer = HolonFarmer;
