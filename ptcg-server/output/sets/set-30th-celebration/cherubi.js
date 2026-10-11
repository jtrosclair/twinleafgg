"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cherubi = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
class Cherubi extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hide',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            },
            {
                name: 'Flop',
                cost: [game_1.CardType.GRASS],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cherubi';
        this.fullName = 'Cherubi 30C';
    }
    reduceEffect(store, state, effect) {
        // Hide
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, effect_of_attack_prefabs_1.PREVENT_DAMAGE)(store, state, effect, this);
                    (0, effect_of_attack_prefabs_1.PREVENT_EFFECTS_OF_ATTACKS)(store, state, effect, this);
                }
            });
        }
        return state;
    }
}
exports.Cherubi = Cherubi;
