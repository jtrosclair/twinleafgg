"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flaaffy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
class Flaaffy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mareep';
        this.hp = 90;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Disconnect',
                cost: [L, C],
                damage: 40,
                text: 'During your opponent\'s next turn, your opponent can\'t play any Item cards from their hand.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Flaaffy';
        this.fullName = 'Flaaffy M4';
        this.DISCONNECT_MARKER = 'FLAAFFY_M4_DISCONNECT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.ADD_MARKER)(this.DISCONNECT_MARKER, opponent, this);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.DISCONNECT_MARKER, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.DISCONNECT_MARKER, this);
        return state;
    }
}
exports.Flaaffy = Flaaffy;
