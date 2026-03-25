"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slakoth2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slakoth2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Boundless Power',
                cost: [C, C, C],
                damage: 60,
                text: 'This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '168';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slakoth';
        this.fullName = 'Slakoth UNM 168';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Boundless Power
        // Ref: set-unbroken-bonds/aggron.ts (Giga Impact - can't attack next turn)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Slakoth2 = Slakoth2;
