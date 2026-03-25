"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avery = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
//Avery is not done yet!! have to add the "remove from bench" logic
class Avery extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.regulationMark = 'E';
        this.name = 'Avery';
        this.fullName = 'Avery CRE';
        this.text = 'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Draw 3 cards
            (0, prefabs_1.DRAW_CARDS)(player, 3);
            // Get opponent
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            // Discard pokemon from opponent's bench until they have 3
            while (opponentBenched > 3) {
                const benchDifference = opponentBenched - 3;
                return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], {
                    allowCancel: false,
                    min: benchDifference,
                    max: benchDifference
                }), (selected) => {
                    selected.forEach((cardList) => {
                        // Separate pokemons, other cards, and tools
                        const pokemons = cardList.getPokemons();
                        const otherCards = cardList.cards.filter((card) => !(card instanceof pokemon_card_1.PokemonCard) &&
                            !pokemons.includes(card) &&
                            (!cardList.tools || !cardList.tools.includes(card)));
                        const tools = [...cardList.tools];
                        // Move other cards to discard using MOVE_CARDS
                        if (otherCards.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: otherCards });
                        }
                        // Move tools to discard using MOVE_CARDS
                        if (tools.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: tools });
                        }
                        // Move Pokémon to discard using MOVE_CARDS
                        if (pokemons.length > 0) {
                            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.discard, { cards: pokemons });
                        }
                    });
                    return state;
                });
            }
            (0, prefabs_1.MOVE_CARDS)(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
            return state;
        }
        return state;
    }
}
exports.Avery = Avery;
