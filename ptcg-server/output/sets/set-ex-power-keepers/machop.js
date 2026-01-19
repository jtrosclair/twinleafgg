"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Smash Punch',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
            {
                name: 'Submission',
                cost: [F, C],
                damage: 30,
                text: 'Machop does 10 damage to itself.'
            }];
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Machop';
        this.fullName = 'Machop PK';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Machop = Machop;
