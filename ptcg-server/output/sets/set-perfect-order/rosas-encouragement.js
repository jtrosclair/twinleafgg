"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RosasEncouragement = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
class RosasEncouragement extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.usSetNumber = 'POR 84';
        this.name = 'Rosa\'s Encouragement';
        this.fullName = 'Rosa\'s Encouragement M3';
        this.text = `You can use this card only if you have more Prize cards remaining than your opponent.

Attach up to 2 Basic Energy cards from your discard pile to 1 of your Stage 2 Pokémon.`;
    }
    canPlay(store, state, player) {
        const opponent = game_1.StateUtils.getOpponent(state, player);
        if (player.supporterTurn > 0) {
            return false;
        }
        if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
            return false;
        }
        const basicEnergyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY &&
            c.energyType === card_types_1.EnergyType.BASIC);
        if (basicEnergyInDiscard.length === 0) {
            return false;
        }
        const stage2Pokemon = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
            const pokemonCard = cardList.getPokemonCard();
            if (pokemonCard && pokemonCard.stage === card_types_1.Stage.STAGE_2) {
                stage2Pokemon.push(cardList);
            }
        });
        if (stage2Pokemon.length === 0) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Check if player has more Prize cards remaining than opponent
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check for Basic Energy in discard
            const basicEnergyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY &&
                c.energyType === card_types_1.EnergyType.BASIC);
            if (basicEnergyInDiscard.length === 0) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Block all non-Stage-2 Pokemon as attach targets
            const blockedTo = [];
            let stage2Count = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (_cardList, card, target) => {
                if (card.stage === card_types_1.Stage.STAGE_2) {
                    stage2Count++;
                }
                else {
                    blockedTo.push(target);
                }
            });
            if (stage2Count === 0) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const maxToAttach = Math.min(2, basicEnergyInDiscard.length);
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: maxToAttach, sameTarget: true, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.RosasEncouragement = RosasEncouragement;
