"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lombre = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lombre extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lotad';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Aqua Slash',
                cost: [W, W],
                damage: 70,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Lombre';
        this.fullName = 'Lombre JTG';
    }
    reduceEffect(store, state, effect) {
        // Aqua Slash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Lombre = Lombre;
