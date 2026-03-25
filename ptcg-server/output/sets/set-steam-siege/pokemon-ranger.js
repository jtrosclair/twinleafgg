"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonRanger = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class PokemonRanger extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'STS';
        this.name = 'Pokémon Ranger';
        this.fullName = 'Pokemon Ranger STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.text = 'Remove all effects of attacks on each player and his ' +
            'or her Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Remove all effects of attacks from both players
            player.removeAttackEffects();
            opponent.removeAttackEffects();
            // Remove all effects of attacks from all Pokemon
            [player, opponent].forEach(p => {
                p.active.removeAttackEffects();
                p.bench.forEach(b => b.removeAttackEffects());
            });
        }
        return state;
    }
}
exports.PokemonRanger = PokemonRanger;
