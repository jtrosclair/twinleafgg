"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrafty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Turf Raid',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your remaining Prize cards.'
            },
            {
                name: 'Headbang',
                cost: [D, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '138';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scrafty';
        this.fullName = 'Scrafty UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Turf Raid
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage += 20 * player.getPrizeLeft();
        }
        return state;
    }
}
exports.Scrafty = Scrafty;
