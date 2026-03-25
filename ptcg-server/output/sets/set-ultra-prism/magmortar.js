"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmortar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const game_2 = require("../../game");
class Magmortar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magmar';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Incandescent Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.'
            }];
        this.attacks = [
            {
                name: 'Fire Blaster',
                cost: [R, R, C],
                damage: 80,
                damageCalculation: '+',
                text: 'You may discard 2 Energy from this Pokémon. If you do, this attack does 80 more damage.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magmortar';
        this.fullName = 'Magmortar UPR';
    }
    reduceEffect(store, state, effect) {
        // Ability: Incandescent Body (passive - burn attacker when damaged)
        // Ref: set-sun-and-moon/poison-barb.ts (Poison Barb - AfterDamageEffect damage retaliation)
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            // Only trigger from opponent's attack
            if (player === opponent) {
                return state;
            }
            // Must be active
            if (player.active !== effect.target) {
                return state;
            }
            // Must have taken damage
            if (effect.damage <= 0) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (state.phase === game_1.GamePhase.ATTACK) {
                const burnEffect = new check_effects_1.AddSpecialConditionsPowerEffect(opponent, this, effect.source, [card_types_1.SpecialCondition.BURNED]);
                store.reduceEffect(state, burnEffect);
            }
        }
        // Attack 1: Fire Blaster
        // Ref: set-temporal-forces/raging-bolt-ex.ts (Bellowing Thunder - DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, costs_1.DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON)(store, state, effect, 2, {}, 0, [game_2.SlotType.ACTIVE], transfers => {
                if (transfers.length >= 2) {
                    effect.damage += 80;
                }
            });
        }
        return state;
    }
}
exports.Magmortar = Magmortar;
