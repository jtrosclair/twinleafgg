"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrangeCave = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StrangeCave extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'LM';
        this.name = 'Strange Cave';
        this.fullName = 'Strange Cave LM';
        this.text = 'Once during each player\'s turn, that player may put an Omanyte, Kabuto, Aerodactyl, Aerodactyl ex, Lileep, or Anorith onto his or her Bench from his or her hand. Treat the new Benched Pokémon as Basic Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const slots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
            prefabs_1.BLOCK_IF_NO_SLOTS(slots);
            const blockedHand = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && (card.name === 'Omanyte' || card.name === 'Kabuto' || card.name === 'Aerodactyl' || card.name === 'Aerodactyl ex' || card.name === 'Lileep' || card.name === 'Anorith')) {
                    return;
                }
                else {
                    blockedHand.push(index);
                }
            });
            if (player.hand.cards.length === 0 || player.hand.cards.length === blockedHand.length) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false, blocked: blockedHand }), selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    player.hand.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
            });
        }
        return state;
    }
}
exports.StrangeCave = StrangeCave;
