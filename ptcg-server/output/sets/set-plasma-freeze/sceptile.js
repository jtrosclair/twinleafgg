"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sceptile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Sceptile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grovyle';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'X-Scissor',
                cost: [G, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 more damage.'
            },
            {
                name: 'Energy Bloom',
                cost: [G, G, C],
                damage: 80,
                text: 'Heal 20 damage from each of your Pokémon that has any Energy attached to it.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sceptile';
        this.fullName = 'Sceptile PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 40);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const hasEnergy = cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
                if (hasEnergy && cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 20);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Sceptile = Sceptile;
