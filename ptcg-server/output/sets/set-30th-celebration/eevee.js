"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Fetch and Hide',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand, and you put an Item card you find there on the bottom of your opponent\'s deck.'
            }, {
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Eevee';
        this.fullName = 'Eevee 30C';
    }
    reduceEffect(store, state, effect) {
        // Fetch and Hide
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHandSnapshot = [...opponent.hand.cards];
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponentHandSnapshot);
            const hasItem = opponent.hand.cards.some(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM);
            if (!hasItem) {
                return state;
            }
            const blocked = [];
            opponent.hand.cards.forEach((c, index) => {
                if (!(c instanceof game_1.TrainerCard) || c.trainerType !== card_types_1.TrainerType.ITEM) {
                    blocked.push(index);
                }
            });
            const deckBottom = new game_1.CardList();
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, {}, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                if (selected && selected.length > 0) {
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, deckBottom, { cards: [selected[0]], sourceCard: this });
                    (0, prefabs_1.MOVE_CARDS)(store, state, deckBottom, opponent.deck, { sourceCard: this });
                }
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
