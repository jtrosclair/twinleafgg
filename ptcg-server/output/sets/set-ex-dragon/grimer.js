"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grimer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Grimer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pound',
                cost: [C],
                damage: 10,
                text: '',
            },
            {
                name: 'Poison Spurt',
                cost: [G],
                damage: 0,
                text: 'Discard a [G] Energy card attached to Grimer. The Defending Pokémon is now Poisoned.',
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Grimer';
        this.fullName = 'Grimer DR';
        this.usedPoisonSpurt = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, card_types_1.CardType.GRASS);
            this.usedPoisonSpurt = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPoisonSpurt === true) {
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedPoisonSpurt) {
            this.usedPoisonSpurt = false;
        }
        return state;
    }
}
exports.Grimer = Grimer;
