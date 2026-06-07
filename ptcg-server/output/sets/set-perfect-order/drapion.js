"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drapion = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drapion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skorupi';
        this.cardType = D;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Wrack Down',
                cost: [D, D],
                damage: 60,
                text: ''
            },
            {
                name: 'Hazard Tail',
                cost: [D, D, D],
                damage: 100,
                text: 'This Pokemon does 70 damage to itself. Your opponent\'s Active Pokemon is now Poisoned and Paralyzed.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.usSetNumber = 'POR 52';
        this.name = 'Drapion';
        this.fullName = 'Drapion M3';
    }
    reduceEffect(store, state, effect) {
        // Hazard Tail - self-damage and poison/paralyze
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 70);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
            (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Drapion = Drapion;
