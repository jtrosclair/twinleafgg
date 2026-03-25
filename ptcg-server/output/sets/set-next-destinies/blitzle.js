"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blitzle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blitzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Thunder Jolt',
                cost: [L, C],
                damage: 30,
                text: 'Flip a coin. If tails, this Pokémon does 10 damage to itself.'
            }];
        this.set = 'NXD';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blitzle';
        this.fullName = 'Blitzle NXD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
                }
            });
        }
        return state;
    }
}
exports.Blitzle = Blitzle;
