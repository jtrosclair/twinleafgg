"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delibird = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Delibird extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 90;
        this.cardType = W;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Happy Present',
                cost: [C],
                damage: 0,
                text: 'Both players may attach up to 3 Energy from their hand to their Pokemon in any way they like. (Your opponent attaches first.)'
            },
            {
                name: 'Flap',
                cost: [C, C],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.usSetNumber = 'CRI 18';
        this.name = 'Delibird';
        this.fullName = 'Delibird M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.AttachEnergyPrompt(opponent.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, opponent.hand, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 3 }), () => {
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 3 }), () => state);
            });
        }
        return state;
    }
}
exports.Delibird = Delibird;
