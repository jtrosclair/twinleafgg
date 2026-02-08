"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haunter extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Haunt',
                cost: [D],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Haunter';
        this.fullName = 'Haunter M3';
    }
    reduceEffect(store, state, effect) {
        // Haunt - put 3 damage counters (30 damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 30);
            putCountersEffect.target = opponent.active;
            store.reduceEffect(state, putCountersEffect);
        }
        return state;
    }
}
exports.Haunter = Haunter;
