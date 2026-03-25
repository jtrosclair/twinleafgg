"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensMetang = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StevensMetang extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Steven\'s Beldum';
        this.tags = [card_types_1.CardTag.STEVENS];
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Metal Slash',
                cost: [M, C],
                damage: 70,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '144';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steven\'s Metang';
        this.fullName = 'Steven\'s Metang DRI';
    }
    reduceEffect(store, state, effect) {
        // Metal Slash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.StevensMetang = StevensMetang;
