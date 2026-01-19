"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolidRage = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class SolidRage extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UF';
        this.name = 'Solid Rage';
        this.fullName = 'Solid Rage UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.text = 'Attach Solid Rage to 1 of your Evolved Pokémon (excluding Pokémon-ex) that doesn\'t already have a Pokémon Tool attached to it. If the Pokémon Solid Rage is attached to is a Basic Pokémon or Pokémon-ex, discard Solid Rage.\n\nIf you have more Prize cards left than your opponent, the Pokémon that Solid Rage is attached to does 20 more damage to the Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard == this) {
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) || effect.target.getPokemons().length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.active.tools.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const attack = effect.attack;
            if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
                if (attack && attack.damage > 0 && effect.target === opponent.active) {
                    effect.damage += 20;
                }
            }
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const attachedTo = cardList.getPokemonCard();
                    if (!!attachedTo && (attachedTo.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                        cardList.moveCardTo(this, player.discard);
                        attachedTo.tools === undefined;
                    }
                });
            });
        }
        return state;
    }
}
exports.SolidRage = SolidRage;
