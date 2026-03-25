"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPetrel = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* playCard(next, store, state, effect, self) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.rocketSupporter = true;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: cards, sourceCard: self });
    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
}
class TeamRocketsPetrel extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.set = 'DRI';
        this.name = 'Team Rocket\'s Petrel';
        this.fullName = 'Team Rocket\'s Petrel DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '176';
        this.regulationMark = 'I';
        this.text = 'Search your deck for a Trainer card, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.rocketSupporter) {
            effect.player.rocketSupporter = false;
        }
        return state;
    }
}
exports.TeamRocketsPetrel = TeamRocketsPetrel;
