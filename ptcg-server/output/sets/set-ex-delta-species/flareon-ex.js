"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareonex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flareonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolutionary Flame',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you play Flareon ex from your hand to evolve 1 of your Pokémon, you may choose 1 of the Defending Pokémon. That Pokémon is now Burned and Confused.'
            }];
        this.attacks = [{
                name: 'Flame Screen',
                cost: [R, C],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done to Flareon ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
            },
            {
                name: 'Heat Tackle',
                cost: [R, C, C],
                damage: 70,
                text: 'Flareon ex does 10 damage to itself.'
            }];
        this.set = 'DS';
        this.setNumber = '108';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Flareon ex';
        this.fullName = 'Flareon ex DS';
        this.FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Devo Flash
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        // Flame Screen
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.FLAME_SCREEN_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.FLAME_SCREEN_MARKER, this)) {
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 20;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.FLAME_SCREEN_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Flareonex = Flareonex;
