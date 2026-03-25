"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slaking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slaking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vigoroth';
        this.cardType = C;
        this.hp = 180;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.DYNAMIC_SWING_MARKER = 'SLAKING_UNM_DYNAMIC_SWING_MARKER';
        this.CLEAR_DYNAMIC_SWING_MARKER = 'SLAKING_UNM_CLEAR_DYNAMIC_SWING_MARKER';
        this.powers = [{
                name: 'Counterattack',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dynamic Swing',
                cost: [C, C, C, C],
                damage: 100,
                damageCalculation: '+',
                text: 'You may do 100 more damage. If you do, during your opponent\'s next turn, this Pokémon takes 100 more damage from attacks (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '170';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slaking';
        this.fullName = 'Slaking UNM';
    }
    reduceEffect(store, state, effect) {
        // Ability: Counterattack (passive - damaged by opponent's attack)
        // Ref: set-unbroken-bonds/aggron.ts (Extra-Tight Press - retaliation), set-lost-thunder/shiinotic.ts (Effect Spore)
        if ((0, prefabs_1.ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT)(state, effect, { source: this })) {
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            // Check that this Pokemon is the Active Pokemon
            if (targetPlayer.active.getPokemonCard() !== this) {
                return state;
            }
            const damageEffect = new attack_effects_1.PutCountersEffect(effect, 40);
            damageEffect.target = effect.source;
            store.reduceEffect(state, damageEffect);
        }
        // Attack 1: Dynamic Swing
        // Refs: set-unbroken-bonds/vikavolt.ts (Electricannon - optional extra damage with ConfirmPrompt)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToBoost => {
                if (wantToBoost) {
                    effect.damage += 100;
                    (0, prefabs_1.ADD_MARKER)(this.DYNAMIC_SWING_MARKER, player.active, this);
                    (0, prefabs_1.ADD_MARKER)(this.CLEAR_DYNAMIC_SWING_MARKER, opponent, this);
                }
            });
        }
        // Take 100 more damage while marker is active
        if (effect instanceof attack_effects_1.DealDamageEffect
            && effect.target.marker.hasMarker(this.DYNAMIC_SWING_MARKER, this)) {
            effect.damage += 100;
        }
        // Cleanup at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DYNAMIC_SWING_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DYNAMIC_SWING_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DYNAMIC_SWING_MARKER, this);
            });
        }
        return state;
    }
}
exports.Slaking = Slaking;
