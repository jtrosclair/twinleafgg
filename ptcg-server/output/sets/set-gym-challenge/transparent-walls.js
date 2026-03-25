"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransparentWalls = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class TransparentWalls extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G2';
        this.setNumber = '125';
        this.name = 'Transparent Walls';
        this.fullName = 'Transparent Walls G2';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Until the end of your opponent\'s next turn, prevent all damage from attacks done to your Benched Pokémon. (Any other effects of attacks still happen.)';
        this.TRANSPARENT_WALLS_MARKER = 'TRANSPARENT_WALLS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            (0, prefabs_1.ADD_MARKER)(this.TRANSPARENT_WALLS_MARKER, player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!(0, prefabs_1.HAS_MARKER)(this.TRANSPARENT_WALLS_MARKER, opponent, this)) {
                return state;
            }
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === opponent) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.TRANSPARENT_WALLS_MARKER, opponent, this)) {
                (0, prefabs_1.REMOVE_MARKER)(this.TRANSPARENT_WALLS_MARKER, opponent, this);
            }
        }
        return state;
    }
}
exports.TransparentWalls = TransparentWalls;
