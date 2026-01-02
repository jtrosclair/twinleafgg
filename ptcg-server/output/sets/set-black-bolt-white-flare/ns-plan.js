"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsPlan = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NsPlan extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'N\'s Plan';
        this.fullName = 'N\'s Plot SV11B';
        this.text = 'Move up to 2 Energy from your Benched Pokémon to your Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Player has no Basic Energy in the discard pile
            let hasEnergy = false;
            let pokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                pokemonCount += 1;
                const basicEnergyAttached = cardList.cards.some(c => {
                    return c instanceof game_1.EnergyCard;
                });
                hasEnergy = hasEnergy || basicEnergyAttached;
            });
            if (!hasEnergy || pokemonCount <= 1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Prepare blockedMap for MoveEnergyPrompt
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (target.slot === game_1.SlotType.ACTIVE) {
                    // Block all energy on Active (can't move from Active)
                    blockedMap.push({ source: target, blocked: Array.from({ length: cardList.cards.length }, (_, i) => i) });
                }
            });
            // Only allow moving to Active
            const blockedTargets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (target.slot !== game_1.SlotType.ACTIVE) {
                    blockedTargets.push(target);
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 2, blockedMap, blockedTo: blockedTargets }), transfers => {
                if (transfers && transfers.length > 0) {
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        if (source) {
                            const target = player.active;
                            prefabs_1.MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
                        }
                    }
                }
                prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            });
        }
        return state;
    }
}
exports.NsPlan = NsPlan;
