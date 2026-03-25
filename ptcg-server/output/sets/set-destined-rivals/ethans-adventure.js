"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansAdventure = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansAdventure extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'DRI';
        this.setNumber = '165';
        this.name = 'Ethan\'s Adventure';
        this.fullName = 'Ethan\'s Adventure DRI';
        this.text = 'Search your deck for up to 3 in any combination of Ethan\'s Pokémon and Basic [R] Energy, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(this, player.supporter);
            (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard && c.tags.includes(game_1.CardTag.ETHANS);
                const isBasicEnergy = c.superType === game_1.SuperType.ENERGY && c.energyType === game_1.EnergyType.BASIC && c.name === 'Fire Energy';
                if (!isPokemon && !isBasicEnergy) {
                    blocked.push(index);
                }
            });
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.deck, {}, { min: 0, max: 3, allowCancel: false, blocked }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: this });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.EthansAdventure = EthansAdventure;
