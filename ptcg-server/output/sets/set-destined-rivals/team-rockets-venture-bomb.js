"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsVentureBomb = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class TeamRocketsVentureBomb extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.set = 'DRI';
        this.regulationMark = 'I';
        this.name = 'Team Rocket\'s Venture Bomb';
        this.fullName = 'Team Rocket\'s Venture Bomb DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.text = 'Flip a coin. If heads, put 2 damage counters on 1 of your opponent\'s Pokémon. If tails, put 2 damage counters on your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 20;
                        });
                    });
                }
                if (!result) {
                    player.active.damage += 20;
                    return state;
                }
            });
            player.supporter.moveTo(player.discard);
            return state;
        }
        return state;
    }
}
exports.TeamRocketsVentureBomb = TeamRocketsVentureBomb;
