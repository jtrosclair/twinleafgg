"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasManaphy2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
class SeasManaphy2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pickup Power',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for an Energy card, show it to your opponent, and put it into your hand.'
            },
            {
                name: 'Aqua Blast',
                cost: [W, C],
                damage: 30,
                text: 'Discard 1 [W] Energy card attached to Sea\'s Manaphy in order to use this attack.'
            }];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.name = 'Sea\'s Manaphy';
        this.fullName = 'Sea\'s Manaphy PCGP 146';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasEnergy = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergy) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: cards });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.WATER);
        }
        return state;
    }
}
exports.SeasManaphy2 = SeasManaphy2;
