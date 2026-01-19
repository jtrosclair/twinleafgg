"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zangoose = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zangoose extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Poison Resistance',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Zangoose can\'t be Poisoned.'
            }];
        this.attacks = [{
                name: 'Target Slash',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Seviper, this attack does 10 damage plus 30 more damage.'
            },
            {
                name: 'Super Slash',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 30 damage plus 30 more damage.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Zangoose';
        this.fullName = 'Zangoose SS';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.specialConditions.includes(card_types_1.SpecialCondition.POISONED) && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Seviper') {
                effect.damage += 30;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.getPokemons().length > 1) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Zangoose = Zangoose;
