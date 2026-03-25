"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamGalacticsInventionG101EnergyGain = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamGalacticsInventionG101EnergyGain extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PL';
        this.name = 'Team Galactic\'s Invention G-101 Energy Gain';
        this.fullName = 'Team Galactic\'s Invention G-101 Energy Gain PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.text = 'Attach Team Galactic\'s Invention G-101 Energy Gain to 1 of your Pokémon SP that doesn\'t already have a Pokémon Tool attached to it. If that Pokémon is Knocked Out, discard this card. When the Pokémon this card is attached to is no longer a Pokémon SP, discard this card. \n\n As long as Team Galactic\'s Invention G-101 Energy Gain is attached to a Pokémon, the attack cost of that Pokémon\'s attacks is [C] less.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard == this) {
            if (!((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_SP))) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (!attachedTo.tags.includes(card_types_1.CardTag.POKEMON_SP))) {
                        cardList.moveCardTo(this, player.discard);
                        attachedTo.tools === undefined;
                    }
                });
            });
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.tools.includes(this)) {
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            if ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_SP)) {
                effect.cost.splice(index, 1);
            }
            return state;
        }
        return state;
    }
}
exports.TeamGalacticsInventionG101EnergyGain = TeamGalacticsInventionG101EnergyGain;
