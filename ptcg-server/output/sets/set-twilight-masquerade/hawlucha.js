"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hawlucha = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hawlucha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Prize Count',
                cost: [F, F],
                damage: 50,
                damageCalculation: '+',
                text: 'If you have more Prize cards remaining than your opponent, this attack does 90 more damage.'
            }];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Hawlucha';
        this.fullName = 'Hawlucha TWM';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (prefabs_1.GET_PLAYER_PRIZES(effect.player) > prefabs_1.GET_PLAYER_PRIZES(game_1.StateUtils.getOpponent(state, effect.player))) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Hawlucha = Hawlucha;
