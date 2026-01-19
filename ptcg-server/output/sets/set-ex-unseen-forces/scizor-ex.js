"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizorex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Scizorex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scyther';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Danger Perception',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Scizor ex\'s remaining HP is 60 or less, Scizor ex does 40 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Steel Wing',
                cost: [M, C],
                damage: 40,
                text: 'During your opponent\'s next turn, any damage done to Scizor ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
            },
            {
                name: 'Cross-Cut',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 50 damage plus 30 more damage.'
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.name = 'Scizor ex';
        this.fullName = 'Scizor ex UF';
        this.STEEL_WING_MARKER = 'STEEL_WING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.source);
            store.reduceEffect(state, checkHpEffect);
            const attack = effect.attack;
            if (attack && attack.damage > 0 && effect.target === opponent.active && checkHpEffect.hp <= 60) {
                console.log(effect.source.hp, effect.source.damage);
                effect.damage += 40;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.STEEL_WING_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        // Reduce damage by 20
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.STEEL_WING_MARKER, this)) {
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 20;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.STEEL_WING_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.opponent.active.getPokemons().length > 1) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Scizorex = Scizorex;
