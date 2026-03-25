"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmaHideout = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TeamMagmaHideout extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'MA';
        this.name = 'Team Magma Hideout';
        this.fullName = 'Team Magma Hideout MA';
        this.text = 'Whenever any player plays a Basic Pokémon that doesn\'t have Team Magma in its name from his or her hand, that player puts 1 damage counter on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.target.cards.length > 0 || effect.pokemonCard.tags.includes(card_types_1.CardTag.TEAM_MAGMA)) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            store.log(state, game_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: owner.name, damage: 10, target: effect.pokemonCard.name, effect: this.name });
            effect.target.damage += 10;
            return state;
        }
        return state;
    }
}
exports.TeamMagmaHideout = TeamMagmaHideout;
