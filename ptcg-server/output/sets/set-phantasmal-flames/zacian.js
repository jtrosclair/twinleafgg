"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zacian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zacian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Limit Break',
                cost: [P, C],
                damage: 50,
                text: 'If your opponent has 3 or fewer Prize cards remaining, this attack does 90 more damage.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Zacian';
        this.fullName = 'Zacian M2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent && opponent.getPrizeLeft() <= 3) {
                // Add 90 more damage if opponent has 3 or fewer Prize cards
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Zacian = Zacian;
