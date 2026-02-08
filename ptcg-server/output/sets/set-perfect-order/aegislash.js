"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aegislash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aegislash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Doublade';
        this.cardType = M;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Slash',
                cost: [C, C, C],
                damage: 80,
                text: ''
            },
            {
                name: 'Metal Slash',
                cost: [M, C, C, C],
                damage: 230,
                text: 'This Pokemon can\'t attack during your next turn.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Aegislash';
        this.fullName = 'Aegislash M3';
    }
    reduceEffect(store, state, effect) {
        // Metal Slash - can't attack next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Aegislash = Aegislash;
