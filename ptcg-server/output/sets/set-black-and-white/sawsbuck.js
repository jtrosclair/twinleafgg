"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawsbuck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Sawsbuck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deerling';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Nature Power',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each [G] Energy attached to all of your Pokémon.'
            },
            {
                name: 'Horn Leech',
                cost: [G, C, C],
                damage: 60,
                text: 'Heal 20 damage from this Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Sawsbuck';
        this.fullName = 'Sawsbuck BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Count all Grass Energy attached to all of your Pokémon
            let grassEnergyCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.forEach(card => {
                    if (card.superType === card_types_1.SuperType.ENERGY && card.provides.includes(card_types_1.CardType.GRASS)) {
                        // Count each Grass energy provided
                        grassEnergyCount += card.provides.filter(t => t === card_types_1.CardType.GRASS).length;
                    }
                });
            });
            effect.damage = 20 + (10 * grassEnergyCount);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Sawsbuck = Sawsbuck;
