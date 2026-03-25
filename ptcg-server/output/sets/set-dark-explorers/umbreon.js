"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Umbreon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Shadow Drain',
                cost: [C, C],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
            },
            {
                name: 'Slashing Strike',
                cost: [D, C, C],
                damage: 80,
                text: 'This Pokémon can\'t use Slashing Strike during your next turn.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '60';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Umbreon';
        this.fullName = 'Umbreon DEX';
    }
    reduceEffect(store, state, effect) {
        // Shadow Drain - heal same amount as damage dealt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const healEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healEffect.target = effect.player.active;
            store.reduceEffect(state, healEffect);
        }
        // Slashing Strike - can't use this attack next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
                player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
            }
        }
        return state;
    }
}
exports.Umbreon = Umbreon;
