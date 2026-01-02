"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venomoth = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Venomoth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = G;
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venonat';
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [{
                name: 'Assassin Flight',
                cost: [C],
                damage: 0,
                text: 'You can use this attack only if your opponent\'s Active Pokémon is affected by a Special Condition. This attack does 90 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Poision Powder',
                cost: [G],
                damage: 30,
                text: ''
            }];
        this.set = 'UNB';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Venomoth';
        this.fullName = 'Venomoth UNB';
        this.usedPoisonPowder = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.opponent.active.specialConditions.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(90, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            this.usedPoisonPowder = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPoisonPowder === true) {
            this.usedPoisonPowder = false;
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Venomoth = Venomoth;
