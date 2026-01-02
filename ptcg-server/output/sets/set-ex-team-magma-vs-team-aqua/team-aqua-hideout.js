"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquaHideout = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class TeamAquaHideout extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Team Aqua Hideout';
        this.fullName = 'Team Aqua Hideout MA';
        this.text = 'Each Pokémon that does not have Team Aqua in its name pays [C] more to retreat.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.TEAM_AQUA)) {
                effect.cost.push(card_types_1.CardType.COLORLESS);
            }
        }
        return state;
    }
}
exports.TeamAquaHideout = TeamAquaHideout;
