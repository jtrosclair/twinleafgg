"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chimchar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Chimchar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [],
                damage: 10,
                text: ''
            },
            {
                name: 'Ember',
                cost: [R, C],
                damage: 30,
                text: 'Flip a coin. If tails, discard a [R] Energy attached to Chimchar.'
            }];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Chimchar';
        this.fullName = 'Chimchar DP';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
                }
            });
        }
        return state;
    }
}
exports.Chimchar = Chimchar;
