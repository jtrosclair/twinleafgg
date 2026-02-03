"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JaninesSecretArt = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class JaninesSecretArt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Janine\'s Secret Art';
        this.fullName = 'Janine\'s Secret Art PRE';
        this.text = 'Choose up to 2 of your [D] Pokémon. For each of those Pokémon, search your deck for a Basic [D] Energy card and attach it to that Pokémon. Then, shuffle your deck. If you attached Energy to your Active Pokémon in this way, it is now Poisoned.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Count Dark Pokemon and ensure we have energy in deck
            const hasDarkEnergy = player.deck.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.DARK);
            });
            if (!hasDarkEnergy) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            // Only allow selecting Dark Pokemon
            const blockedTargets = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.DARK) {
                    blockedTargets.push(target);
                }
            });
            let attachedToActive = false;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, cardType: card_types_1.CardType.DARK }, { allowCancel: false, min: 0, max: 2, blockedTo: blockedTargets, differentTargets: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    // Check if we attached to active
                    if (target === player.active) {
                        attachedToActive = true;
                    }
                }
                // Shuffle deck
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
                // Apply poison if we attached to active
                if (attachedToActive) {
                    player.active.specialConditions.push(card_types_1.SpecialCondition.POISONED);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.JaninesSecretArt = JaninesSecretArt;
