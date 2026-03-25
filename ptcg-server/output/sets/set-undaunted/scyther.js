"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cut',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Slashing Strike',
                cost: [G, C, C],
                damage: 50,
                text: 'During your next turn, Scyther can\'t use Slashing Strike.'
            }];
        this.set = 'UD';
        this.name = 'Scyther';
        this.fullName = 'Scyther UD';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
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
exports.Scyther = Scyther;
