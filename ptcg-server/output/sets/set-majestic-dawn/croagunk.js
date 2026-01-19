"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croagunk = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Croagunk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Light Punch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Poison Sting',
                cost: [P],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Croagunk';
        this.fullName = 'Croagunk MD';
        this.usedPoisonSting = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedPoisonSting = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPoisonSting) {
            this.usedPoisonSting = false;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Croagunk = Croagunk;
