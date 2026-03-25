"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conkeldurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Conkeldurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gurdurr';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Chip Away',
                cost: [F],
                damage: 40,
                text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
            }, {
                name: 'Swing Around',
                cost: [F, F, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
            }];
        this.set = 'NVI';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Conkeldurr';
        this.fullName = 'Conkeldurr NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 40);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += 30 * heads;
            });
        }
        return state;
    }
}
exports.Conkeldurr = Conkeldurr;
