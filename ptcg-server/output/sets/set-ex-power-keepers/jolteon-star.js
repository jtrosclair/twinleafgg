"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JolteonStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class JolteonStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.STAR];
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Yellow Ray',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Jolteon Star from your hand onto your Bench, you may put 1 damage counter on each Active Pokémon (both yours and your opponent\'s).'
            }];
        this.attacks = [{
                name: 'Agility',
                cost: [L, L, C],
                damage: 40,
                text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Jolteon Star during your opponent\'s next turn.'
            }];
        this.set = 'PK';
        this.name = 'Jolteon Star';
        this.fullName = 'Jolteon Star PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.YELLOW_RAY_MARKER = 'YELLOW_RAY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !prefabs_1.IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                    const effectOfAbility = new game_effects_1.EffectOfAbilityEffect(effect.player, this.powers[0], this, opponent.active);
                    store.reduceEffect(state, effectOfAbility);
                    if (effectOfAbility.target) {
                        opponent.active.damage += 10;
                    }
                    player.active.damage += 10;
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.YELLOW_RAY_MARKER, this);
                    prefabs_1.ADD_MARKER(this.YELLOW_RAY_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.YELLOW_RAY_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.YELLOW_RAY_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.YELLOW_RAY_MARKER, effect.player, this);
            this.marker.removeMarker(this.YELLOW_RAY_MARKER, this);
        }
        return state;
    }
}
exports.JolteonStar = JolteonStar;
