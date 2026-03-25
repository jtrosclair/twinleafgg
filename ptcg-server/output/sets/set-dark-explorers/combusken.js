"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combusken = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Combusken extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Torchic';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Kick',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 70,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Combusken';
        this.fullName = 'Combusken DEX';
    }
    reduceEffect(store, state, effect) {
        // Double Kick attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        // Flamethrower attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Combusken = Combusken;
