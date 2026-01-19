"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dangle Tail',
                cost: [C],
                damage: 0,
                text: 'Put a Pokémon from your discard pile into your hand.'
            },
            {
                name: 'Tackle',
                cost: [P, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasCardInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.Card;
            });
            if (!hasCardInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: game_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false })
            ], selected => {
                const cards = new game_1.CardList();
                if (selected) {
                    cards.cards = selected;
                }
                selected.forEach(card => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                (0, prefabs_1.MOVE_CARDS)(store, state, cards, player.hand);
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
