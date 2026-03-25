"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HereComesTeamRocket = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
class HereComesTeamRocket extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Here Comes Team Rocket!';
        this.fullName = 'Here Comes Team Rocket! TRR';
        this.text = 'Each player turns all of his or her Prize cards face up. (Those Prize cards remain face up for the rest of the game.)';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            player.prizes.forEach((prize) => {
                if (!prize.faceUpPrize) {
                    prize.faceUpPrize = true;
                    prize.isSecret = false;
                    prize.isPublic = true;
                }
            });
            opponent.prizes.forEach((prize) => {
                if (!prize.faceUpPrize) {
                    prize.faceUpPrize = true;
                    prize.isSecret = false;
                    prize.isPublic = true;
                }
            });
        }
        return state;
    }
}
exports.HereComesTeamRocket = HereComesTeamRocket;
