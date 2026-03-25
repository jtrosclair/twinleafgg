"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LadyOuting = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class LadyOuting extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Lady Outing';
        this.fullName = 'Lady Outing RS';
        this.text = 'Search your deck for up to 3 different types of basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const uniqueBasicEnergies = Math.min(3, player.deck.cards
                .filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC)
                .map(e => e.provides[0])
                .filter((value, index, self) => self.indexOf(value) === index)
                .length);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: uniqueBasicEnergies, allowCancel: false, differentTypes: true }), selected => {
                if (selected.length > 1) {
                    if (selected[0].name === selected[1].name) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                    }
                }
                if (selected.length === 0) {
                    return state;
                }
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected, sourceCard: this });
            });
            return state;
        }
        return state;
    }
}
exports.LadyOuting = LadyOuting;
