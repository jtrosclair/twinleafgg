"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Shake Vine',
                cost: [],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Bullet Seed',
                cost: [G, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
            }];
        this.set = 'SW';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Bulbasaur = Bulbasaur;
