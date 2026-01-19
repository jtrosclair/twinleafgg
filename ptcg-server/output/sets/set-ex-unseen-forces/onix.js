"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Onix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Dig Deep',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for an Energy card, show it to your opponent, and put it into your hand.'
            },
            {
                name: 'Mud Slap',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Onix';
        this.fullName = 'Onix UF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasSupporter = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasSupporter) {
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
        return state;
    }
}
exports.Onix = Onix;
