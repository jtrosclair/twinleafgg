"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxicroak = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Toxicroak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Croagunk';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P, value: +20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Paralyze Poison',
                cost: [P],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned. Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned.'
            },
            {
                name: 'Slash',
                cost: [P, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Toxicroak';
        this.fullName = 'Toxicroak MD';
        this.usedParalyzePoison = false;
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedParalyzePoison = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedParalyzePoison) {
            this.usedParalyzePoison = false;
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Toxicroak = Toxicroak;
