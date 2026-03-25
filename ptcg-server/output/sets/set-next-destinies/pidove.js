"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidove = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidove extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scout',
                cost: [C],
                damage: 0,
                text: 'Your opponent reveals his or her hand.'
            },
            {
                name: 'Gust',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pidove';
        this.fullName = 'Pidove NXD';
    }
    reduceEffect(store, state, effect) {
        // Scout
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => { });
            }
        }
        return state;
    }
}
exports.Pidove = Pidove;
