"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.resistance = [{ type: P, value: -30 }];
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
                text: 'Flip a coin for each of your Pokémon in play (including this one). This attack does 20 damage times the number of heads.'
            }];
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel N1';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 10 * heads;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let monCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, p => {
                monCount++;
            });
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, monCount, results => {
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
