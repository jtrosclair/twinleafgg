"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Vaporeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Muddy Water',
                cost: [C],
                damage: 20,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Spiral Drain',
                cost: [W, C, C],
                damage: 60,
                text: 'Heal 20 damage from this Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vaporeon';
        this.fullName = 'Vaporeon DEX';
    }
    reduceEffect(store, state, effect) {
        // Muddy Water - 20 to active + 20 to benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
            }
        }
        // Spiral Drain - heal 20
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Vaporeon = Vaporeon;
