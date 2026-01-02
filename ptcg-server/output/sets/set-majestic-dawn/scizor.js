"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizor = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scizor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scyther';
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R, value: +30 }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Special Blow',
                cost: [M],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has any Special Energy cards attached to it, this attack does 30 damage plus 50 more damage.'
            },
            {
                name: 'X-Scissor',
                cost: [M, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 50 damage plus 40 more damage.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Scizor';
        this.fullName = 'Scizor MD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.opponent.active.energies.cards.some(c => c.energyType === card_types_1.EnergyType.SPECIAL)) {
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 50);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
        }
        return state;
    }
}
exports.Scizor = Scizor;
