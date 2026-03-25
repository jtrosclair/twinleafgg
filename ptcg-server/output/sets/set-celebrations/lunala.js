"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunala = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunala extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cosmoem';
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Lunar Pain',
                cost: [C, C],
                damage: 0,
                text: 'Double the number of damage counters on each of your opponent\'s Pokémon.'
            },
            {
                name: 'Psychic Shot',
                cost: [P, C, C],
                damage: 130,
                text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'E';
        this.set = 'CEL';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lunala';
        this.fullName = 'Lunala CEL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            const activeDamageEffect = new attack_effects_1.PutCountersEffect(effect, opponent.active.damage);
            activeDamageEffect.target = opponent.active;
            store.reduceEffect(state, activeDamageEffect);
            opponent.bench.forEach((bench, index) => {
                if (bench.cards.length > 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, bench.damage);
                    damageEffect.target = bench;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(30, effect, store, state);
        }
        return state;
    }
}
exports.Lunala = Lunala;
