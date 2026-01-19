"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarniesImpidimp = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MarniesImpidimp extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MARNIES];
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Filch', cost: [C], damage: 0, text: 'Draw a card.' },
            { name: 'Corkscrew Punch', cost: [D], damage: 10, text: '' },
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '134';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marnie\'s Impidimp';
        this.fullName = 'Marnie\'s Impidimp DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 1);
            return state;
        }
        return state;
    }
}
exports.MarniesImpidimp = MarniesImpidimp;
