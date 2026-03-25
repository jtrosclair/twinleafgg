"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
class Bisharp2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Night Slash',
                cost: [D, C],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Metal Claw',
                cost: [D, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If this Pokémon has any damage counters on it, this attack does 50 more damage. Then, switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp NVI 76';
        this.usedNightSlash = false;
        this.usedMetalClaw = false;
    }
    reduceEffect(store, state, effect) {
        // Night Slash - may switch self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedNightSlash = true;
        }
        // Metal Claw - +50 if damaged, switch opponent's active
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.damage > 0) {
                effect.damage += 50;
            }
            this.usedMetalClaw = true;
        }
        // After Night Slash, optionally switch self
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedNightSlash) {
            this.usedNightSlash = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToSwitch => {
                    if (wantToSwitch) {
                        (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                    }
                });
            }
        }
        // After Metal Claw, switch opponent's active
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedMetalClaw) {
            this.usedMetalClaw = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_2.EndTurnEffect) {
            this.usedNightSlash = false;
            this.usedMetalClaw = false;
        }
        return state;
    }
}
exports.Bisharp2 = Bisharp2;
