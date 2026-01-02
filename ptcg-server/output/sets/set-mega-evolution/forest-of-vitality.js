"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LushForest = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LushForest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'MEG';
        this.name = 'Forest of Vitality';
        this.fullName = 'Forest of Vitality MEG';
        this.legacyFullName = 'Lush Forest M1S';
        this.regulationMark = 'I';
        this.text = 'Each player\'s [G] Pokémon can evolve into another [G] Pokémon during the turn they play those Pokémon. (Players can\'t evolve a Pokémon during their first turn.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (state.turn > 2) {
                if (effect.pokemonCard.cardType === card_types_1.CardType.GRASS) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
                        store.reduceEffect(state, checkPokemonTypeEffect);
                        if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.GRASS)) {
                            cardList.pokemonPlayedTurn = state.turn - 1;
                        }
                    });
                }
            }
        }
        return state;
    }
}
exports.LushForest = LushForest;
