"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scolipede = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scolipede extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Whirlipede';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Toxic Claws',
                cost: [P, C],
                damage: 30,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
            },
            {
                name: 'Wild Horn',
                cost: [P, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Scolipede';
        this.fullName = 'Scolipede EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this, 20);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Scolipede = Scolipede;
