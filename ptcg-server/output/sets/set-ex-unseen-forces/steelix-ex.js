"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelixex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Steelixex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 150;
        this.weakness = [{ type: R }, { type: F }];
        this.resistance = [{ type: G, value: -30 }, { type: L, value: -30 }];
        this.retreat = [C, C, C, C, C];
        this.powers = [{
                name: 'Poison Resistance',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Steelix ex can\'t be Poisoned.'
            }];
        this.attacks = [{
                name: 'Metal Charge',
                cost: [M, C, C],
                damage: 70,
                text: 'Put 1 damage counter on Steelix ex.'
            },
            {
                name: 'Mudslide',
                cost: [F, F, C, C],
                damage: 0,
                text: 'Discard 2 [F] Energy attached to Steelix ex and choose 1 of your opponent\'s Pokémon. This attack does 100 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Steelix ex';
        this.fullName = 'Steelix ex UF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.specialConditions.includes(card_types_1.SpecialCondition.POISONED) && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.player.active.damage += 10;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, card_types_1.CardType.FIGHTING);
            attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(100, effect, store, state);
        }
        return state;
    }
}
exports.Steelixex = Steelixex;
