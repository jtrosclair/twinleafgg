"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doublade = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Doublade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Honedge';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Slash',
                cost: [C],
                damage: 20,
                text: ''
            }, {
                name: 'Slashing Strike',
                cost: [M, C],
                damage: 80,
                text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Doublade';
        this.fullName = 'Doublade PAR';
    }
    reduceEffect(store, state, effect) {
        // Slashing Strike
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
                player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
            }
        }
        return state;
    }
}
exports.Doublade = Doublade;
