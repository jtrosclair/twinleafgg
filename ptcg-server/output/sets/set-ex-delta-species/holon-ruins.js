"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonRuins = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonRuins extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DS';
        this.name = 'Holon Ruins';
        this.fullName = 'Holon Ruins DS';
        this.text = 'Each player that has any Pokémon in play that has delta on its card may draw a card once during his or her turn. If the player does, he or she discards a card from his or her hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            let deltaCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    deltaCount++;
                }
            });
            if (deltaCount === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });
                cards.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                });
            });
        }
        return state;
    }
}
exports.HolonRuins = HolonRuins;
