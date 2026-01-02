"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatFactoryPrismStar = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const energy_card_1 = require("../../game/store/card/energy-card");
class HeatFactoryPrismStar extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.set = 'LOT';
        this.setNumber = '178';
        this.name = 'Heat Factory Prism Star';
        this.fullName = 'Heat Factory Prism Star LOT';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Once during each player\'s turn, that player may discard a [R] Energy card from their hand. If they do, they draw 3 cards.\n\nWhenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const stadiumUsedTurn = player.stadiumUsedTurn;
            let hasCardsInHand = false;
            const blocked = [];
            player.hand.cards.forEach((c, index) => {
                if (c instanceof energy_card_1.EnergyCard) {
                    if (c.provides.includes(card_types_1.CardType.FIRE)) {
                        hasCardsInHand = true;
                    }
                    else {
                        blocked.push(index);
                    }
                }
            });
            if (hasCardsInHand === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1, blocked }), selected => {
                selected = selected || [];
                if (selected.length === 0) {
                    player.stadiumUsedTurn = stadiumUsedTurn;
                    return;
                }
                player.hand.moveCardsTo(selected, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
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
exports.HeatFactoryPrismStar = HeatFactoryPrismStar;
