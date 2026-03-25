"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentureBomb = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class VentureBomb extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ROCKETS_SECRET_MACHINE];
        this.set = 'TRR';
        this.name = 'Venture Bomb';
        this.fullName = 'Venture Bomb TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.text = 'Flip a coin. If heads, put 1 damage counter on 1 of your opponent\'s Pokémon. If tails, put 1 damage counter on 1 of your Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 10;
                        });
                    });
                }
                if (!result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 10;
                        });
                    });
                }
            });
            player.supporter.moveTo(player.discard);
            return state;
        }
        return state;
    }
}
exports.VentureBomb = VentureBomb;
