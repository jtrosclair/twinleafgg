"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serperior = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Serperior extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Servine';
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Vine Whip',
                cost: [C, C],
                damage: 40,
                text: ''
            },
            {
                name: 'Leaf Storm',
                cost: [G, G],
                damage: 60,
                text: 'Heal 20 damage from each of your Grass Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Serperior';
        this.fullName = 'Serperior BLW 5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Heal 20 damage from each of your Grass Pokémon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.cardType === card_types_1.CardType.GRASS) {
                    const healEffect = new attack_effects_1.HealTargetEffect(effect, 20);
                    healEffect.target = cardList;
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.Serperior = Serperior;
