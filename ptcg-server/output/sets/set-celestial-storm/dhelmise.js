"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dhelmise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
// CES Dhelmise 22 (https://limitlesstcg.com/cards/CES/22)
class Dhelmise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Giga Drain',
                cost: [G, C],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Powerful Spin',
                cost: [G, G, C],
                damage: 130,
                text: 'This Pokémon can\'t attack during your next turn.'
            }];
        this.set = 'CES';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dhelmise';
        this.fullName = 'Dhelmise CES';
    }
    reduceEffect(store, state, effect) {
        // Giga Drain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        // Powerful Spin
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Dhelmise = Dhelmise;
