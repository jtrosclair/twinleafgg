"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steelix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = M;
        this.hp = 200;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Welcoming Tail',
                cost: [C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'If you have exactly 6 Prize cards remaining, this attack does 200 more damage.'
            },
            {
                name: 'Skull Bash',
                cost: [M, M, C, C],
                damage: 140,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Steelix';
        this.fullName = 'Steelix M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.getPrizeLeft() === 6) {
                effect.damage += 200;
            }
        }
        return state;
    }
}
exports.Steelix = Steelix;
