"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kakuna = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kakuna extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Weedle';
        this.hp = 80;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokemon takes 20 less damage from attacks.'
            }];
        this.attacks = [{
                name: 'Hang Down',
                cost: [G],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.usSetNumber = 'POR 2';
        this.name = 'Kakuna';
        this.fullName = 'Kakuna M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            if (effect.target.getPokemonCard() === this) {
                effect.damage = Math.max(0, effect.damage - 20);
            }
        }
        return state;
    }
}
exports.Kakuna = Kakuna;
