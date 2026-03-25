"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sealeo = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Sealeo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spheal';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Super Icy Wind',
                cost: [W],
                damage: 0,
                text: 'Does 10 damage to each of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Skull Bash',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Sealeo';
        this.fullName = 'Sealeo HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Sealeo = Sealeo;
