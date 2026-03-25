"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aggron = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Aggron extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lairon';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Knock Back',
                cost: [M, C],
                damage: 50,
                text: 'Your opponent switches the Defending Pok\u00e9mon with 1 of his or her Benched Pok\u00e9mon.'
            },
            {
                name: 'Aura of the Land',
                cost: [M, M, C, C],
                damage: 80,
                text: 'Does 20 damage to each Benched Pok\u00e9mon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '59';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Aggron';
        this.fullName = 'Aggron PLB';
        this.usedKnockBack = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedKnockBack = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedKnockBack) {
            this.usedKnockBack = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedKnockBack) {
            this.usedKnockBack = false;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage opponent's bench
            opponent.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 20);
                    damage.target = benched;
                    store.reduceEffect(state, damage);
                }
            });
            // Damage player's bench
            player.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const damage = new attack_effects_1.PutDamageEffect(effect, 20);
                    damage.target = benched;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.Aggron = Aggron;
