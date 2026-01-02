"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarkMountain = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class StarkMountain extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Stark Mountain';
        this.fullName = 'Stark Mountain LA';
        this.text = 'Once during each player\'s turn, that player may choose a [R] or [F] Energy attached to 1 of his or her Pokémon and move that Energy to 1 of his or her [R] or [F] Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const blockedMap = [];
            // Determine blocked energy cards for each Pokémon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedIndices = new Set();
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.FIRE) && !em.provides.includes(card_types_1.CardType.FIGHTING) && !em.provides.includes(card_types_1.CardType.ANY)) {
                        const index = cardList.cards.indexOf(em.card);
                        if (index !== -1) {
                            blockedIndices.add(index);
                        }
                    }
                });
                if (blockedIndices.size > 0) {
                    blockedMap.push({ source: target, blocked: Array.from(blockedIndices) });
                }
            });
            // Determine valid targets (Fire or Fighting Pokémon)
            const invalidTargets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(list);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (!checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIRE) && !checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                    invalidTargets.push(target);
                }
            });
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1, blockedMap, blockedTo: invalidTargets }), transfers => {
                if (transfers && transfers.length > 0) {
                    for (const transfer of transfers) {
                        const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                        const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                        if (source && target) {
                            source.moveCardTo(transfer.card, target);
                        }
                    }
                }
            });
        }
        return state;
    }
}
exports.StarkMountain = StarkMountain;
