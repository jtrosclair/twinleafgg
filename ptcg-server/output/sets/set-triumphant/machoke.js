"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Knuckle Down',
                cost: [F],
                damage: 30,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            },
            {
                name: 'Strength',
                cost: [F, F, C],
                damage: 60,
                text: ''
            }];
        this.set = 'TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Machoke';
        this.fullName = 'Machoke TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Machoke = Machoke;
