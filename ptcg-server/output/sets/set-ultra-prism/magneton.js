"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Ram',
                cost: [M],
                damage: 20,
                text: ''
            },
            {
                name: 'Zap Cannon',
                cost: [M, M, C],
                damage: 80,
                text: 'This Pokémon can\'t use Zap Cannon during your next turn.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magneton';
        this.fullName = 'Magneton UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Zap Cannon
        // Ref: AGENTS-patterns.md (can't use attack next turn)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotUseAttacksNextTurnPending.push('Zap Cannon');
        }
        return state;
    }
}
exports.Magneton = Magneton;
