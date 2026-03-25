"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilape = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Annihilape extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Primeape';
        this.cardType = F;
        this.hp = 150;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Vessel of Rage',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has 2 or more damage counters on it, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Impact Blow',
                cost: [F, F],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t use Impact Blow.'
            }];
        this.set = 'DRI';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Annihilape';
        this.fullName = 'Annihilape DRI';
    }
    reduceEffect(store, state, effect) {
        // Vessel of Rage
        if (effect instanceof game_effects_1.AttackEffect && effect.source.cards.includes(this)) {
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (effect.source.damage >= 20) {
                effect.damage += 120;
            }
        }
        // Impact Blow
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Impact Blow')) {
                player.active.cannotUseAttacksNextTurnPending.push('Impact Blow');
            }
        }
        return state;
    }
}
exports.Annihilape = Annihilape;
