"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokenTimeSpace = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BrokenTimeSpace extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PL';
        this.name = 'Broken Time-Space';
        this.fullName = 'Broken Time-Space PL';
        this.text = 'Each player may evolve a Pokémon that he or she just played or evolved during that turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            player.canEvolve = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                cardList.pokemonPlayedTurn = state.turn - 1;
            });
        }
        return state;
    }
}
exports.BrokenTimeSpace = BrokenTimeSpace;
