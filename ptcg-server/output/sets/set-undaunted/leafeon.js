"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leafeon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Leafeon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Miasma Wind',
                cost: [C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Does 50 damage damage times the number of Special Conditions affecting the Defending Pokémon.'
            },
            {
                name: 'Soothing Scent',
                cost: [G],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Leafeon';
        this.fullName = 'Leafeon UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            effect.damage = 50 * oppActive.specialConditions.length;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Leafeon = Leafeon;
