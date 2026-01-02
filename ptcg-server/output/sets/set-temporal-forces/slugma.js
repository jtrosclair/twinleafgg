"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slugma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Roasting Heat',
                cost: [R],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is Burned, this attack does 40 more damage.',
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Slugma';
        this.fullName = 'Slugma TEF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.opponent.active.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Slugma = Slugma;
