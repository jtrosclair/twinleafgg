"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koffing = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Koffing extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Blow-Away Bomb',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you discard this Pokémon with the effect of Roxie, you may put 1 damage counter on each of your opponent\'s Pokémon. (Place damage counters after the effect of Roxie.)'
            }];
        this.attacks = [{
                name: 'Poison Gas',
                cost: [P, C],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'CEC';
        this.name = 'Koffing';
        this.fullName = 'Koffing CEC';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.usedPoisonGas = false;
    }
    reduceEffect(store, state, effect) {
        // Blow-Away Bomb is handled in Roxie. 
        // It shouldn't be, so if you can figure out how to get it to be contained in Koffing and Weezing themselves, please do so.
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedPoisonGas = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPoisonGas === true) {
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedPoisonGas) {
            this.usedPoisonGas = false;
        }
        return state;
    }
}
exports.Koffing = Koffing;
