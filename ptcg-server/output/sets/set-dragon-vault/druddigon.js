"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Druddigon = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Druddigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 110;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Tight Jaw',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pok\u00e9mon is now Paralyzed.'
            },
            {
                name: 'Dragon Tail',
                cost: [R, W, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Druddigon';
        this.fullName = 'Druddigon DRV';
    }
    reduceEffect(store, state, effect) {
        // Tight Jaw - flip for paralysis
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        // Dragon Tail - flip 2, 80x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 80 * heads;
            });
        }
        return state;
    }
}
exports.Druddigon = Druddigon;
