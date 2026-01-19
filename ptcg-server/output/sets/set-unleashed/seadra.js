"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seadra = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seadra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Horsea';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Muddy Water',
                cost: [W],
                damage: 20,
                text: 'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Razor Fin',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Seadra';
        this.fullName = 'Seadra UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Seadra = Seadra;
