"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GougingFire = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GougingFire extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Knock Down',
                cost: [R],
                damage: 30,
                text: ''
            },
            {
                name: 'Blazing Charge',
                cost: [R, R, C],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent has 4 or fewer Prize cards remaining, this attack does 70 more damage. '
            }
        ];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Gouging Fire';
        this.fullName = 'Gouging Fire SSP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentPrizes = opponent.getPrizeLeft();
            if (opponentPrizes <= 4) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.GougingFire = GougingFire;
