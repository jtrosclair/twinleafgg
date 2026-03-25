"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelingCologne = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class CancelingCologne extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Canceling Cologne';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.fullName = 'Canceling Cologne ASR';
        this.text = 'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';
        this.CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.CANCELING_COLOGNE_MARKER, opponent, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            // Check if Canceling Cologne marker is active on either player
            if ((0, prefabs_1.HAS_MARKER)(this.CANCELING_COLOGNE_MARKER, player, this) || (0, prefabs_1.HAS_MARKER)(this.CANCELING_COLOGNE_MARKER, opponent, this)) {
                // Filter out all abilities
                effect.powers = effect.powers.filter(power => power.powerType !== pokemon_types_1.PowerType.ABILITY);
            }
        }
        if (effect instanceof game_effects_1.PowerEffect && (0, prefabs_1.HAS_MARKER)(this.CANCELING_COLOGNE_MARKER, effect.player, this)
            && (effect.power.powerType === pokemon_types_1.PowerType.ABILITY)) {
            throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const owner = __1.StateUtils.findOwner(state, __1.StateUtils.findCardList(state, this));
            if (player === owner) {
                (0, prefabs_1.REMOVE_MARKER)(this.CANCELING_COLOGNE_MARKER, player, this);
                (0, prefabs_1.REMOVE_MARKER)(this.CANCELING_COLOGNE_MARKER, opponent, this);
            }
        }
        return state;
    }
}
exports.CancelingCologne = CancelingCologne;
