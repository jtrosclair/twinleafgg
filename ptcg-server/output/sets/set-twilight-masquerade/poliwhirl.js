"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poliwhirl = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Poliwhirl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poliwag';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Hypnosis',
                cost: [W],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            },
            {
                name: 'Double Slap',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage for each heads.',
            },
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Poliwhirl';
        this.fullName = 'Poliwhirl TWM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, (results) => {
                effect.damage = 30 * results.reduce((sum, r) => (sum + (r ? 1 : 0)), 0);
            });
        }
        return state;
    }
}
exports.Poliwhirl = Poliwhirl;
