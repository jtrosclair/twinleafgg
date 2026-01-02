"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WondrousLabyrinthPrismStar = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class WondrousLabyrinthPrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'TEU';
        this.setNumber = '158';
        this.name = 'Wondrous Labyrinth Prism Star';
        this.fullName = 'Wondrous Labyrinth Prism Star TEU';
        this.cardImage = 'assets/cardback.png';
        this.text = 'The attacks of non-[Y] Pokémon (both yours and your opponent\'s) cost [C] more.\n\nWhenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            // Check if the Pokémon is Fairy
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            const isFairyPokemon = checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FAIRY);
            if (!isFairyPokemon) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index > -1) {
                    effect.cost.splice(index, 0, card_types_1.CardType.COLORLESS);
                }
                else {
                    effect.cost.push(card_types_1.CardType.COLORLESS);
                }
            }
            return state;
        }
        // Prevent effects of Item and Supporter cards on this Stadium
        if (effect instanceof game_effects_1.MoveCardsEffect
            && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.sourceCard instanceof trainer_card_1.TrainerCard &&
                (effect.sourceCard.trainerType === card_types_1.TrainerType.SUPPORTER || effect.sourceCard.trainerType === card_types_1.TrainerType.ITEM)) {
                const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
                if (stadiumCard !== undefined) {
                    const cardList = state_utils_1.StateUtils.findCardList(state, stadiumCard);
                    if (effect.source === cardList) {
                        effect.preventDefault = true;
                    }
                }
            }
        }
        return state;
    }
}
exports.WondrousLabyrinthPrismStar = WondrousLabyrinthPrismStar;
