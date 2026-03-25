"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lilligant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lilligant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Petilil';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Petal Dance',
                cost: [G],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads. This Pokémon is now Confused.'
            },
            {
                name: 'Leaf Storm',
                cost: [G, C],
                damage: 30,
                text: 'Heal 20 damage from each of your Grass Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Lilligant';
        this.fullName = 'Lilligant BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
            // This Pokémon becomes Confused
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Heal 20 from each Grass Pokémon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.cardType === card_types_1.CardType.GRASS) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 20);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Lilligant = Lilligant;
