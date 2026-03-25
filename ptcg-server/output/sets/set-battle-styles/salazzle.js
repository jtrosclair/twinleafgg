"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzle = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salazzle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Perplex',
                cost: [R],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Derisive Roasting',
                cost: [C, C],
                damage: 90,
                damageCalculation: 'x',
                text: 'This attack does 90 damage for each Special Condition affecting your opponent\'s Active Pokémon.'
            }];
        this.set = 'BST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Salazzle';
        this.fullName = 'Salazzle BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            effect.damage = 90 * oppActive.specialConditions.length;
        }
        return state;
    }
}
exports.Salazzle = Salazzle;
