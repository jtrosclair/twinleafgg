"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyrunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tyrunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Jaw Fossil';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Get Angry',
                cost: [F, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each damage counter on this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.usSetNumber = 'POR 44';
        this.name = 'Tyrunt';
        this.fullName = 'Tyrunt M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage = effect.player.active.damage * 2;
            return state;
        }
        return state;
    }
}
exports.Tyrunt = Tyrunt;
