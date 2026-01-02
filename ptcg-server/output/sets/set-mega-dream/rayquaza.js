"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rayquaza = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Rayquaza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 120;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Assault Break',
                cost: [L, C],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 90 more damage.'
            },
            {
                name: 'Dragon Claw',
                cost: [R, L, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.name = 'Rayquaza';
        this.fullName = 'Rayquaza M2a';
        this.movedToActiveThisTurn = false;
    }
    reduceEffect(store, state, effect) {
        // Reset flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.movedToActiveThisTurn) {
            this.movedToActiveThisTurn = false;
        }
        // Set flag when another Pokemon retreats (this one might be switching in)
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.getPokemonCard() !== this) {
            this.movedToActiveThisTurn = true;
        }
        // Handle Assault Break attack - add 90 damage if moved from bench this turn
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.movedToActiveThisTurn) {
                effect.damage += 90;
            }
        }
        return state;
    }
}
exports.Rayquaza = Rayquaza;
