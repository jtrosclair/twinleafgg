"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zorua = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zorua extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Take Down',
                cost: [D],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Zorua';
        this.fullName = 'Zorua SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Zorua = Zorua;
