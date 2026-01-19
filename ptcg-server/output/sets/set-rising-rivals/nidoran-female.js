"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoranFemale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NidoranFemale extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [P],
                damage: 10,
                text: ''
            },
            {
                name: 'Offer Help',
                cost: [C, C],
                damage: 0,
                text: 'Search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Nidoran F';
        this.fullName = 'Nidoran F RR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0)
                return state;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1 }), selected => {
                const cards = selected || [];
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.NidoranFemale = NidoranFemale;
