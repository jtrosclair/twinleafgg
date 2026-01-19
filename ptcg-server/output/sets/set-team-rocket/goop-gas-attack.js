"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoopGasAttack = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class GoopGasAttack extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.setNumber = '78';
        this.name = 'Goop Gas Attack';
        this.fullName = 'Goop Gas Attack TR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'All Pokémon Powers stop working until the end of your opponent\'s next turn.';
        this.GOOP_GAS_MARKER = 'GOOP_GAS_MARKER';
        this.GOOP_GAS_MARKER_2 = 'GOOP_GAS_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.GOOP_GAS_MARKER, player, this);
            (0, prefabs_1.ADD_MARKER)(this.GOOP_GAS_MARKER, opponent, this);
            (0, prefabs_1.MOVE_CARD_TO)(state, effect.trainerCard, player.discard);
        }
        if (effect instanceof game_effects_1.PowerEffect && (0, prefabs_1.HAS_MARKER)(this.GOOP_GAS_MARKER, effect.player, this)
            && (effect.power.powerType === game_1.PowerType.POKEMON_POWER || effect.power.powerType === game_1.PowerType.POKEBODY || effect.power.powerType === game_1.PowerType.POKEPOWER)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const owner = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            if (player !== owner) {
                (0, prefabs_1.REMOVE_MARKER)(this.GOOP_GAS_MARKER, player, this);
                (0, prefabs_1.REMOVE_MARKER)(this.GOOP_GAS_MARKER, opponent, this);
            }
        }
        return state;
    }
}
exports.GoopGasAttack = GoopGasAttack;
