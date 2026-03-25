"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poipole = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Poipole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Belt',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Last Scene',
                cost: [P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If each player has exactly 1 Prize card remaining, this attack does 130 more damage.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '102';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Poipole';
        this.fullName = 'Poipole UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Last Scene
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() === 1 && opponent.getPrizeLeft() === 1) {
                effect.damage += 130;
            }
        }
        return state;
    }
}
exports.Poipole = Poipole;
