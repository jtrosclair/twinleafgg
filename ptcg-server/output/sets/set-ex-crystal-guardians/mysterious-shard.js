"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteriousShard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
const state_1 = require("../../game/store/state/state");
class MysteriousShard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'CG';
        this.name = 'Mysterious Shard';
        this.fullName = 'Mysterious Shard CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.text = 'Attach Mysterious Shard to 1 of your Pokémon (excluding Pokémon-ex) that doesn\'t already have a Pokémon Tool attached to it. If the Pokémon Mysterious Shard is attached to is a Pokémon-ex, discard this card. \n\nPrevent all effects of attacks, including damage, done to the Pokémon that Mysterious Shard is attached to by your opponent\'s Pokémon-ex .Discard this card at the end of your opponent\'s next turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (!effect.target.cards.includes(this) || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const opponent = state_utils_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                if (prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return state;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
                        return state;
                    }
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                        prefabs_1.MOVE_CARD_TO(state, this, player.discard);
                    }
                });
            });
            return state;
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard == this) {
            if ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Discard card at the end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                    if (cardList.tools.includes(this) && state_utils_1.StateUtils.findOwner(state, cardList) !== effect.player) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
        }
        return state;
    }
}
exports.MysteriousShard = MysteriousShard;
