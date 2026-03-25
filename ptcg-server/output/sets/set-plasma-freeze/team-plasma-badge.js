"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamPlasmaBadge = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamPlasmaBadge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLF';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Plasma Badge';
        this.fullName = 'Team Plasma Badge PLF';
        this.text = 'The Pokémon this card is attached to is a Team Plasma Pokémon.';
        this.injectedTeamPlasmaTags = new Map();
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const activeBadgeTargets = new Set();
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
                    const hasBadge = cardList.tools.includes(this) && !(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this);
                    if (!hasBadge) {
                        return;
                    }
                    activeBadgeTargets.add(pokemonCard.id);
                    if (!pokemonCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                        pokemonCard.tags.push(card_types_1.CardTag.TEAM_PLASMA);
                        this.injectedTeamPlasmaTags.set(pokemonCard.id, pokemonCard);
                    }
                });
            });
            for (const [id, pokemonCard] of this.injectedTeamPlasmaTags) {
                if (activeBadgeTargets.has(id)) {
                    continue;
                }
                const idx = pokemonCard.tags.indexOf(card_types_1.CardTag.TEAM_PLASMA);
                if (idx !== -1) {
                    pokemonCard.tags.splice(idx, 1);
                }
                this.injectedTeamPlasmaTags.delete(id);
            }
        }
        return state;
    }
}
exports.TeamPlasmaBadge = TeamPlasmaBadge;
