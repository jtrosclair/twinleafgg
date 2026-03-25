"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blazikenex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Blazikenex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Combusken';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 150;
        this.weakness = [{ type: W }, { type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Blaze Kick',
                cost: [R, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 damage plus 20 more damage. If tails, this attack does 30 damage and the Defending Pokémon is now Burned.'
            },
            {
                name: 'Volcanic Ash',
                cost: [R, R, C, C],
                damage: 0,
                text: 'Discard 2 [R] Energy attached to Blaziken ex and then choose 1 of your opponent\'s Pokémon. This attack does 100 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Blaziken ex';
        this.fullName = 'Blaziken ex MA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, card_types_1.CardType.FIRE);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(100, effect, store, state);
        }
        return state;
    }
}
exports.Blazikenex = Blazikenex;
