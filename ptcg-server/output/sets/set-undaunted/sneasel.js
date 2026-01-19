"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Fury Swipes',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Beat Up',
                cost: [D, D],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip a coin for each of your Pokémon in play. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'UD';
        this.setNumber = '68';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 10 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, playerBench + 1, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Sneasel = Sneasel;
