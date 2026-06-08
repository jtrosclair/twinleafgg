"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skuntank = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skuntank extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Stunky';
        this.hp = 110;
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rear Kick',
                cost: [D],
                damage: 40,
                text: ''
            },
            {
                name: 'Smash Turn',
                cost: [D, D, C],
                damage: 100,
                text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.usSetNumber = 'CRI 54';
        this.name = 'Skuntank';
        this.fullName = 'Skuntank M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        return state;
    }
}
exports.Skuntank = Skuntank;
