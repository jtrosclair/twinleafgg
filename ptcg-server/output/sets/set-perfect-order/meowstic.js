"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowstic = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowstic extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Espurr';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Perplex',
                cost: [P],
                damage: 0,
                text: 'Your opponent\'s Active Pokemon is now Confused.'
            },
            {
                name: 'Psychic',
                cost: [P],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Meowstic';
        this.fullName = 'Meowstic M3';
    }
    reduceEffect(store, state, effect) {
        // Perplex - confuse opponent's Active Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
        }
        // Psychic - damage based on opponent's energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const energyCount = opponent.active.cards.filter(card => card instanceof game_1.EnergyCard).length;
            effect.damage = 30 + (energyCount * 30);
        }
        return state;
    }
}
exports.Meowstic = Meowstic;
