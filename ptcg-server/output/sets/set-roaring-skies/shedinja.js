"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shedinja = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Shedinja extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nincada';
        this.cardType = G;
        this.hp = 30;
        this.retreat = [C];
        this.attacks = [{
                name: 'Cursed Rain',
                cost: [G],
                damage: 0,
                text: 'Put 1 damage counter on each of your opponent\'s Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Hopeless Scream',
                cost: [C],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage times the number of damage counters on this Pokémon.'
            }];
        this.set = 'ROS';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shedinja';
        this.fullName = 'Shedinja ROS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(1, store, state, effect);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.damage = effect.source.damage * 5;
        }
        return state;
    }
}
exports.Shedinja = Shedinja;
