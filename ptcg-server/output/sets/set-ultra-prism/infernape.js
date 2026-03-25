"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infernape = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Infernape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Monferno';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Flaming Fighter',
                powerType: game_1.PowerType.ABILITY,
                text: 'Put 6 damage counters instead of 2 on your opponent\'s Burned Pokémon between turns.'
            }];
        this.attacks = [
            {
                name: 'Burst Punch',
                cost: [R, C],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Infernape';
        this.fullName = 'Infernape UPR';
    }
    reduceEffect(store, state, effect) {
        // Ability: Flaming Fighter (passive - increase burn damage between turns)
        // Ref: set-journey-together/magmortar.ts (Magma Surge - BetweenTurnsEffect burn modifier)
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let infernapeOwner = null;
            [player, opponent].forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        infernapeOwner = p;
                    }
                });
            });
            if (!infernapeOwner) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, infernapeOwner, this)) {
                return state;
            }
            const infernapeOpponent = state_utils_1.StateUtils.getOpponent(state, infernapeOwner);
            if (effect.player === infernapeOpponent && infernapeOpponent.active.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                // Normal burn does 2 damage counters (20 damage), we want 6 (60 damage)
                // So add 40 more (4 more damage counters)
                effect.burnDamage += 40;
            }
        }
        // Attack 1: Burst Punch
        // Ref: AGENTS-patterns.md (Burned)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Infernape = Infernape;
