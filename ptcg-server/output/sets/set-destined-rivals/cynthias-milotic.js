"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasMilotic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CynthiasMilotic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cynthia\'s Feebas';
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Aqua Split',
                cost: [W, C],
                damage: 60,
                text: 'This attack also does 30 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Milotic';
        this.fullName = 'Cynthia\'s Milotic DRI';
    }
    reduceEffect(store, state, effect) {
        // Aqua Split
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state, 1, 2);
        }
        return state;
    }
}
exports.CynthiasMilotic = CynthiasMilotic;
