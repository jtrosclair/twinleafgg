"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteonex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jolteonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = L;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Evolutionary Thunder',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Jolteon ex from your hand to evolve 1 of your Pokémon, you may put 1 damage counter on each of your opponent\'s Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Second Bite',
                cost: [L, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 20 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            },
            {
                name: 'Thunder Blast',
                cost: [L, C, C],
                damage: 70,
                text: 'Discard a [L] Energy card attached to Jolteon ex.'
            },
        ];
        this.set = 'DS';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jolteon ex';
        this.fullName = 'Jolteon ex DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                        const effectOfAbility = new game_effects_1.EffectOfAbilityEffect(effect.player, this.powers[0], this, cardList);
                        effectOfAbility.target = cardList;
                        store.reduceEffect(state, effectOfAbility);
                        if (effectOfAbility.target) {
                            cardList.damage += 10;
                        }
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage += effect.opponent.active.damage;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, L);
        }
        return state;
    }
}
exports.Jolteonex = Jolteonex;
