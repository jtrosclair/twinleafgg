"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charcadet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charcadet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Best Punch',
                cost: [R],
                damage: 40,
                text: 'Flip a coin. If tails, this attack does nothing.',
            }];
        this.set = 'M5';
        this.setNumber = '10';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Charcadet';
        this.fullName = 'Charcadet M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Charcadet = Charcadet;
