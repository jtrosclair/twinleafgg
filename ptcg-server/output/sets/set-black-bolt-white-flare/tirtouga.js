"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tirtouga = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tirtouga extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Cover Fossil';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Ancient Debris',
                cost: [W],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each Item card in your opponent\'s discard pile.'
            },
            {
                name: 'Surf',
                cost: [W, C, C],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tirtouga';
        this.fullName = 'Tirtouga SV11B';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let opponentItems = 0;
            opponent.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.ITEM) {
                    opponentItems += 1;
                }
            });
            effect.damage = opponentItems * 30;
        }
        return state;
    }
}
exports.Tirtouga = Tirtouga;
