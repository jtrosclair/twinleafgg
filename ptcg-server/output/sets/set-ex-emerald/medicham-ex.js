"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medichamex = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Medichamex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Wise Aura',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as Medicham ex is your Active Pokémon, each Pokémon (excluding Pokémon-ex) (both yours and your opponent\'s) can\'t use any Poké-Powers.'
            }];
        this.attacks = [
            {
                name: 'Pure Power',
                cost: [C, C],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
            },
            {
                name: 'Sky Kick',
                cost: [F, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has Fighting Resistance, this attack does 60 damage plus 40 more damage.'
            }
        ];
        this.set = 'EM';
        this.setNumber = '95';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Medicham ex';
        this.fullName = 'Medicham ex EM';
        this.evolvesFrom = 'Meditite';
    }
    reduceEffect(store, state, effect) {
        // Handle Wise Aura Poké-Body
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER && effect.power.name !== 'Wise Aura') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cardList = state_utils_1.StateUtils.findCardList(state, effect.card);
            // Medicham ex is not active Pokemon
            const playerHasMedicham = player.active.getPokemonCard() === this;
            const opponentHasMedicham = opponent.active.getPokemonCard() === this;
            if (!playerHasMedicham && !opponentHasMedicham) {
                return state;
            }
            // Check if the Pokemon is a Pokemon-ex
            if (effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Check if we can apply the Ability lock to target Pokemon
            if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
                const canApplyAbility = new game_effects_1.EffectOfAbilityEffect(playerHasMedicham ? player : opponent, this.powers[0], this, cardList);
                store.reduceEffect(state, canApplyAbility);
                if (!canApplyAbility.target) {
                    return state;
                }
            }
            // Apply Ability lock
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Handle Pure Power attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(3, store, state, effect);
        }
        // Handle Sky Kick attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const defendingPokemon = opponent.active.getPokemonCard();
            if (defendingPokemon && defendingPokemon.resistance) {
                const fightingResistance = defendingPokemon.resistance.find(r => r.type === card_types_1.CardType.FIGHTING);
                if (fightingResistance) {
                    effect.damage += 40;
                }
            }
        }
        return state;
    }
}
exports.Medichamex = Medichamex;
