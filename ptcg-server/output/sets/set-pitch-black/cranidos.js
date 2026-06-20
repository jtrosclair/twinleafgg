"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cranidos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cranidos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Skull Fossil';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Fling Off',
                cost: [F, F],
                damage: 70,
                text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '42';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cranidos';
        this.fullName = 'Cranidos M5';
        this.usedFlingOff = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            if (opponent.bench.some(b => b.cards.length > 0)) {
                this.usedFlingOff = true;
            }
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedFlingOff && effect.attack === this.attacks[0]) {
            this.usedFlingOff = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                return (0, prefabs_1.OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON)(store, state, player);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedFlingOff = false;
        }
        return state;
    }
}
exports.Cranidos = Cranidos;
