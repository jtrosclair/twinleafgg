"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Druddigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Druddigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 100;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Big Swing',
                cost: [R],
                damage: 40,
                text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
            },
            {
                name: 'Shred',
                cost: [W, C, C],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Druddigon';
        this.fullName = 'Druddigon PLB';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Big Swing - both coins must be heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                if (results.some(r => !r)) {
                    effect.damage = 0;
                }
            });
        }
        // Attack 2: Shred - ignore effects on defending Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 60);
        }
        return state;
    }
}
exports.Druddigon = Druddigon;
