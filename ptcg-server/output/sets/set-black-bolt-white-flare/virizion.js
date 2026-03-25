"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virizion = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Virizion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Giga Drain',
                cost: [G],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Emerald Blade',
                cost: [G, G, C],
                damage: 130,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Virizion';
        this.fullName = 'Virizion SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const healTime = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healTime.target = effect.player.active;
            store.reduceEffect(state, healTime);
        }
        // Emerald Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Virizion = Virizion;
