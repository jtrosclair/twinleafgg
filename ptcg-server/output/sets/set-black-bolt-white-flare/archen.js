"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archen = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Archen extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Plume Fossil';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Acrobatics',
                cost: [F, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archen';
        this.fullName = 'Archen SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 30 * heads;
            });
        }
        return state;
    }
}
exports.Archen = Archen;
