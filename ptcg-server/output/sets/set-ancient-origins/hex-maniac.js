"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexManiac = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class HexManiac extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'AOR';
        this.setNumber = '75';
        this.name = 'Hex Maniac';
        this.fullName = 'Hex Maniac AOR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Until the end of your opponent\'s next turn, each Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities. (This includes cards that come into play on that turn.)';
        this.HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            prefabs_1.ADD_MARKER(this.HEX_MANIAC_MARKER, player, this);
            prefabs_1.ADD_MARKER(this.HEX_MANIAC_MARKER, opponent, this);
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
        if (effect instanceof game_effects_1.PowerEffect && prefabs_1.HAS_MARKER(this.HEX_MANIAC_MARKER, effect.player, this)
            && (effect.power.powerType === game_1.PowerType.ABILITY)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const owner = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            if (player !== owner) {
                prefabs_1.REMOVE_MARKER(this.HEX_MANIAC_MARKER, player, this);
                prefabs_1.REMOVE_MARKER(this.HEX_MANIAC_MARKER, opponent, this);
            }
        }
        return state;
    }
}
exports.HexManiac = HexManiac;
