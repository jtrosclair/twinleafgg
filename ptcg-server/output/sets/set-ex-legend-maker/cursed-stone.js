"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursedStone = void 0;
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CursedStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'LM';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cursed Stone';
        this.fullName = 'Cursed Stone LM';
        this.text = 'At any time between turns, each player puts 1 damage counter on his or her Pokémon that has a Poké-Power.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // idk why this hits both player's pokemon, it might be getting confused as to what the player specified is so it defaults to both, but hey, it works, so i don't care.
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEPOWER)) {
                        cardList.damage += (10);
                    }
                }
            });
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.CursedStone = CursedStone;
