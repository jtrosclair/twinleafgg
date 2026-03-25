"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stunfisk2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Stunfisk2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Mud Shot',
                cost: [C, C],
                damage: 20,
                text: ''
            }, {
                name: 'Thunder',
                cost: [L, C, C],
                damage: 60,
                text: 'Flip a coin. If tails, this Pokémon does 30 damage to itself.'
            }];
        this.set = 'NVI';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Stunfisk';
        this.fullName = 'Stunfisk NVI 42';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
                }
            });
        }
        return state;
    }
}
exports.Stunfisk2 = Stunfisk2;
