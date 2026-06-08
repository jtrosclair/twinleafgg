"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carnivine = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Carnivine extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 110;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Chomp Down',
                cost: [C, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokemon has no Retreat Cost, this attack does 80 more damage.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.usSetNumber = 'CRI 4';
        this.name = 'Carnivine';
        this.fullName = 'Carnivine M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.retreat.length === 0) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Carnivine = Carnivine;
