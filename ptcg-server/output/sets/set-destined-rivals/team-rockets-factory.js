"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsFactory = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class TeamRocketsFactory extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DRI';
        this.regulationMark = 'I';
        this.name = 'Team Rocket\'s Factory';
        this.fullName = 'Team Rocket\'s Factory DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.text = 'Once during either player\'s turn, if a player plays a Supporter with Team Rocket in its name from their hand, they may draw 2 cards.';
        this.FACTORY_USED_MARKER = 'FACTORY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (!player.rocketSupporter) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
            prefabs_1.DRAW_CARDS(player, 2);
            player.marker.addMarker(this.FACTORY_USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FACTORY_USED_MARKER, this)) {
            effect.player.marker.removeMarker(this.FACTORY_USED_MARKER, this);
        }
        return state;
    }
}
exports.TeamRocketsFactory = TeamRocketsFactory;
