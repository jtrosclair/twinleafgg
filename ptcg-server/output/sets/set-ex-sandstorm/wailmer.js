"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C, C],
                damage: 20,
                text: '',
            },
            {
                name: 'Super Hypno Wave',
                cost: [W, C, C],
                damage: 30,
                text: 'The Defending Pokémon is now Asleep.',
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer SS';
        this.usedSuperHypnoWave = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedSuperHypnoWave = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSuperHypnoWave === true) {
            this.usedSuperHypnoWave = false;
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Wailmer = Wailmer;
