"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crustle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Crustle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dwebble';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Cut',
                cost: [G, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Heavy Bullet',
                cost: [G, C, C],
                damage: 70,
                text: 'Flip a coin. If heads, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Crustle';
        this.fullName = 'Crustle DEX';
    }
    reduceEffect(store, state, effect) {
        // Heavy Bullet attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent has benched Pokémon
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
                    }
                });
            }
        }
        return state;
    }
}
exports.Crustle = Crustle;
