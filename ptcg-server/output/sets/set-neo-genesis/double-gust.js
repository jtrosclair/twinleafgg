"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleGust = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DoubleGust extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'N1';
        this.name = 'Double Gust';
        this.fullName = 'Double Gust N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.text = 'If you have any Benched Pokémon, your opponent chooses 1 of them and switches it with your Active Pokémon. Then, if your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppBenchCount = opponent.bench.reduce((sum, b) => {
                return sum + (b.cards.length > 0 ? 1 : 0);
            }, 0);
            const playerBenchCount = player.bench.reduce((sum, b) => {
                return sum + (b.cards.length > 0 ? 1 : 0);
            }, 0);
            if (!oppBenchCount && !playerBenchCount) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Opponent gust effect
            store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 0, allowCancel: false }), result => {
                const cardList = result[0];
                if (cardList) {
                    const targetCard = new play_card_effects_1.TrainerTargetEffect(player, effect.trainerCard, cardList);
                    targetCard.target = cardList;
                    store.reduceEffect(state, targetCard);
                    if (targetCard.target) {
                        player.switchPokemon(targetCard.target);
                    }
                }
                // Player gust effect
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 0, allowCancel: false }), result => {
                    const cardList = result[0];
                    if (cardList) {
                        const targetCard = new play_card_effects_1.TrainerTargetEffect(player, effect.trainerCard, cardList);
                        targetCard.target = cardList;
                        store.reduceEffect(state, targetCard);
                        if (targetCard.target) {
                            opponent.switchPokemon(targetCard.target);
                        }
                    }
                });
            });
        }
        return state;
    }
}
exports.DoubleGust = DoubleGust;
