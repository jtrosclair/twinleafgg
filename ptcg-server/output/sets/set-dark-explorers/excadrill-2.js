"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excadrill2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Excadrill2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Drilbur';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Reinforced Drill',
                cost: [F, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If this Pokémon has a Pokémon Tool card attached to it, this attack does 30 more damage.'
            },
            {
                name: 'Mach Claw',
                cost: [F, C, C, C],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Excadrill';
        this.fullName = 'Excadrill DEX 57';
    }
    reduceEffect(store, state, effect) {
        // Reinforced Drill - +30 damage if Tool attached
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.tools && player.active.tools.length > 0) {
                effect.damage += 30;
            }
        }
        // Mach Claw - ignore resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Excadrill2 = Excadrill2;
