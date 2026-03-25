"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pansear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Beat',
                cost: [C],
                damage: 10,
                text: ''
            }, {
                name: 'Lunge',
                cost: [R, C, C],
                damage: 60,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'NVI';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pansear';
        this.fullName = 'Pansear NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Pansear = Pansear;
