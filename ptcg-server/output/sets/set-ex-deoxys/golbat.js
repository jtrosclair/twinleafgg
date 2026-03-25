"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golbat = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zubat';
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [];
        this.powers = [{
                name: 'Self-control',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Golbat can\'t be Paralyzed.'
            }];
        this.attacks = [{
                name: 'Spiral Drain',
                cost: [G, C],
                damage: 20,
                text: 'Remove 1 damage counter from Golbat.'
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Golbat';
        this.fullName = 'Golbat DX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED) && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Golbat = Golbat;
