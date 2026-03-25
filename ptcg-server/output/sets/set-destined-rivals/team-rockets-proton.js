"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsProton = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TeamRocketsProton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '177';
        this.name = 'Team Rocket\'s Proton';
        this.fullName = 'Team Rocket\'s Proton DRI';
        this.firstTurn = true;
        this.text = `If you go first, you may use this card during your first turn.

Search your deck for up to 3 Basic Team Rocket's Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.rocketSupporter = true;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const blocked = player.deck.cards
                .filter(c => !c.tags.includes(card_types_1.CardTag.TEAM_ROCKET))
                .map(c => player.deck.cards.indexOf(c));
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 3, allowCancel: false, blocked: blocked }), selectedCards => {
                cards = selectedCards || [];
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: cards, sourceCard: this });
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.rocketSupporter) {
            effect.player.rocketSupporter = false;
        }
        return state;
    }
}
exports.TeamRocketsProton = TeamRocketsProton;
