"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackMarketPrismStar = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BlackMarketPrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'TEU';
        this.setNumber = '134';
        this.name = 'Black Market Prism Star';
        this.fullName = 'Black Market Prism Star TEU';
        this.cardImage = 'assets/cardback.png';
        this.text = 'When a [D] Pokémon (yours or your opponent\'s) that has any [D] Energy attached to it is Knocked Out by damage from an opponent\'s attack, that player takes 1 fewer Prize card.\n\nWhenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // Check if the Pokémon is Dark
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            const isDarkPokemon = checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.DARK);
            // Check if the Pokémon has any [D] Energy attached to it
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, effect.target);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarknessEnergy = state_utils_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.DARK]);
            if (isDarkPokemon && hasDarknessEnergy) {
                effect.prizeCount -= 1;
            }
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
exports.BlackMarketPrismStar = BlackMarketPrismStar;
