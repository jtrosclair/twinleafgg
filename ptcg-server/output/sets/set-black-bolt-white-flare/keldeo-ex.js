"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keldeoex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Keldeoex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 210;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gale Thrust',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon moved from the Bench to the Active Spot this turn, this attack does 90 more damage.'
            },
            {
                name: 'Sonic Edge',
                cost: [W, C, C],
                damage: 120,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Keldeo ex';
        this.fullName = 'Keldeo ex SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, prefabs_1.MOVED_TO_ACTIVE_THIS_TURN)(effect.player, this)) {
                effect.damage += 90;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 120);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Keldeoex = Keldeoex;
