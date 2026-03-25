"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chinchou = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chinchou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Random Spark',
                cost: [L],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            },
            {
                name: 'Lightning Ball',
                cost: [L, C],
                damage: 20,
                text: '',
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Chinchou';
        this.fullName = 'Chinchou HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(10, effect, store, state, 1, 1, false, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]);
        }
        return state;
    }
}
exports.Chinchou = Chinchou;
