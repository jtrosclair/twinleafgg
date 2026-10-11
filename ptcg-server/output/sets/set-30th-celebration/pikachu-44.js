"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pikachu44 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const effect_of_attack_prefabs_1 = require("../../game/store/prefabs/effect-of-attack-prefabs");
/** #44 — Agility */
class Pikachu44 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = game_1.CardType.LIGHTNING;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Agility',
                cost: [game_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Pikachu';
        this.fullName = 'Pikachu 30C 44';
    }
    reduceEffect(store, state, effect) {
        // Agility
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
exports.Pikachu44 = Pikachu44;
