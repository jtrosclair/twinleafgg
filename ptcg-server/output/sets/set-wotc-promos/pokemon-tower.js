"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonTower = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
// WIP - requires changing nearly everything to use MoveCardsEffect
class PokemonTower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Pokemon Tower';
        this.fullName = 'Pokemon Tower PR';
        this.text = 'If the effect of a Pokémon Power, attack, Energy card, or Trainer card would put a card in a discard pile into its owner\'s hand, that card stays in that discard pile instead.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.MoveCardsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            // Check if the source is in the discard pile of any player and destination is hand
            const isDiscardToHand = state.players.some(player => effect.source === player.discard && effect.destination === player.hand);
            if (isDiscardToHand) {
                // Only prevent if the effect is from a Pokémon Power, attack, Energy card, or Trainer card
                if (effect.sourceEffect && (effect.sourceEffect.powerType === game_1.PowerType.POKEMON_POWER ||
                    effect.sourceEffect.powerType === game_1.PowerType.POKEPOWER ||
                    effect.sourceEffect.powerType === game_1.PowerType.POKEBODY)) {
                    effect.preventDefault = true;
                    return state;
                }
                if ((_a = effect.sourceCard) === null || _a === void 0 ? void 0 : _a.attacks.some(attack => { var _a; return attack.name === ((_a = effect.sourceEffect) === null || _a === void 0 ? void 0 : _a.name); })) {
                    effect.preventDefault = true;
                    return state;
                }
                if (effect.sourceCard instanceof trainer_card_1.TrainerCard || ((_b = effect.sourceCard) === null || _b === void 0 ? void 0 : _b.superType) === game_1.SuperType.ENERGY) {
                    effect.preventDefault = true;
                    return state;
                }
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.PokemonTower = PokemonTower;
