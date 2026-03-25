"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swanna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swanna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ducklett';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Healing Dance',
                cost: [W],
                damage: 0,
                text: 'Heal 30 damage from each of your Pokémon.'
            },
            {
                name: 'Incessant Peck',
                cost: [W, W, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin until you get tails. This attack does 20 more damage for each heads.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Swanna';
        this.fullName = 'Swanna DEX';
    }
    reduceEffect(store, state, effect) {
        // Healing Dance - heal 30 from each of your Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                store.reduceEffect(state, healEffect);
            });
        }
        // Incessant Peck - flip until tails, +20 for each heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.FLIP_UNTIL_TAILS_AND_COUNT_HEADS)(store, state, effect.player, headsCount => {
                effect.damage += 20 * headsCount;
            });
        }
        return state;
    }
}
exports.Swanna = Swanna;
