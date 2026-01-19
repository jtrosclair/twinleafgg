"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Scratch',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Flamethrower',
                cost: [R, C, C],
                damage: 50,
                text: 'Discard 1 [R] Energy card attached to Charmeleon.'
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon EX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 20 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.Charmeleon = Charmeleon;
