"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiramex = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reshiramex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 230;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Slash',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Blaze Burst',
                cost: [R, R, C],
                damage: 130,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Prize card your opponent has taken. Discard an Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reshiram ex';
        this.fullName = 'Reshiram ex SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const additionalDamage = 50 * prizesTaken;
            // Apply additional damage based on prizes taken
            effect.damage += additionalDamage;
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Reshiramex = Reshiramex;
