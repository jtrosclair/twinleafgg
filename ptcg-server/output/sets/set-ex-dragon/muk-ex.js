"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mukex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Mukex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Toxic Gas',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Muk ex is your Active Pokémon, ignore all Poké-Powers and Poké-Bodies other than Toxic Gas.'
            }];
        this.attacks = [{
                name: 'Poison Breath',
                cost: [G],
                damage: 10,
                text: 'The Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Slimy Water',
                cost: [G, G, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 40 damage plus 10 more damage for each [C] Energy in the Defending Pokémon\'s Retreat Cost (after applying effects to the Retreat Cost).'
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Muk ex';
        this.fullName = 'Muk ex DR';
        this.usedPoisonSpurt = false;
    }
    reduceEffect(store, state, effect) {
        // Toxic Gas
        if (effect instanceof game_effects_1.PowerEffect && (effect.power.powerType === game_1.PowerType.POKEPOWER || effect.power.powerType === game_1.PowerType.POKEBODY) && effect.power.name !== 'Toxic Gas') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Muk is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Poison Breath
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedPoisonSpurt = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedPoisonSpurt === true) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedPoisonSpurt) {
            this.usedPoisonSpurt = false;
        }
        // Slimy Water
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive) {
                const checkRetreatCostEffect = new check_effects_1.CheckRetreatCostEffect(opponent);
                store.reduceEffect(state, checkRetreatCostEffect);
                const retreatCost = checkRetreatCostEffect.cost.length;
                effect.damage += retreatCost * 10;
            }
        }
        return state;
    }
}
exports.Mukex = Mukex;
