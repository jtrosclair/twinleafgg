"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaTurbo = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MegaTurbo extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.set = 'ROS';
        this.name = 'Mega Turbo';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.fullName = 'Mega Turbo ROS';
        this.text = 'Attach a basic Energy card from your discard pile to 1 of your Mega Evolution Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === game_1.SuperType.ENERGY
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let hasMegaPokemonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (list && list.cards.some(card => card.tags.includes(game_1.CardTag.MEGA))) {
                    hasMegaPokemonInPlay = true;
                }
            });
            if (!hasMegaPokemonInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.MEGA)) {
                    blocked2.push(target);
                }
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.MegaTurbo = MegaTurbo;
