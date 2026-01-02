"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsSneakAttack = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class RocketsSneakAttack extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.setNumber = '16';
        this.name = 'Rocket\'s Sneak Attack';
        this.fullName = 'Rocket\'s Sneak Attack TR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Look at your opponent\'s hand. If he or she has any Trainer cards, choose 1 of them. Your opponent shuffles that card into his or her deck.';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, opponent.hand, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                prefabs_1.MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards });
                prefabs_1.SHUFFLE_DECK(store, state, opponent);
                prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.RocketsSneakAttack = RocketsSneakAttack;
