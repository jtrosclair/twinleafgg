"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrocksGrit = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BrocksGrit extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EVO';
        this.name = 'Brock\'s Grit';
        this.fullName = 'Brock\'s Grit EVO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.text = 'Shuffle 6 in any combination of Pokémon and basic Energy cards from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            let pokemonsOrEnergyInDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                const isPokemon = c instanceof pokemon_card_1.PokemonCard;
                const isBasicEnergy = c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                if (isPokemon || isBasicEnergy) {
                    pokemonsOrEnergyInDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Player does not have correct cards in discard
            if (pokemonsOrEnergyInDiscard === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 6, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                cards.forEach((card) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                });
                (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: cards, sourceCard: this });
                (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.BrocksGrit = BrocksGrit;
