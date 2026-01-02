"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxrayGL = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LuxrayGL extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Trash Bolt',
                cost: [L, C, C],
                damage: 70,
                text: 'Discard an Energy card from your hand. (If you can\'t discard a card from your hand, this attack does nothing.)'
            }
        ];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Luxray GL';
        this.fullName = 'Luxray GL RR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    effect.damage = 0;
                    return state;
                }
                prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards });
                return state;
            });
        }
        return state;
    }
}
exports.LuxrayGL = LuxrayGL;
