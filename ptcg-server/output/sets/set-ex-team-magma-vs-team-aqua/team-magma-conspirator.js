"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmaConspirator = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmaConspirator extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Team Magma Conspirator';
        this.fullName = 'Team Magma Conspirator MA';
        this.text = 'Search your deck for up to 2 in any combination of Basic Pokémon with Team Magma in its name and basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_MAGMA) && card.stage === card_types_1.Stage.BASIC) {
                    return;
                }
                else if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 2, allowCancel: false, blocked }), selected => {
                if (selected) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected });
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.TeamMagmaConspirator = TeamMagmaConspirator;
