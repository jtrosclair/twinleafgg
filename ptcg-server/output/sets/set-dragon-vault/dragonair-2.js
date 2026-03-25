"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = N;
        this.hp = 70;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Healing Melody',
                cost: [G],
                damage: 0,
                text: 'Heal 10 damage from each of your Pok\u00e9mon.'
            },
            {
                name: 'Slam',
                cost: [L, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair DRV 4';
    }
    reduceEffect(store, state, effect) {
        // Healing Melody - Heal 10 from each of your Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        // Slam - Flip 2 coins, 30x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Dragonair2 = Dragonair2;
