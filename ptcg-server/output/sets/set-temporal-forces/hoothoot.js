"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoothoot = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoothoot extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.hp = 70;
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Silent Wing',
                cost: [C, C],
                damage: 20,
                text: 'Your opponent reveals their hand.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Hoothoot';
        this.fullName = 'Hoothoot TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => state);
        }
        return state;
    }
}
exports.Hoothoot = Hoothoot;
