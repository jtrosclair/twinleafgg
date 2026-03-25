"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unfezant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Unfezant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tranquill';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fly',
                cost: [C, C],
                damage: 50,
                text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
            },
            {
                name: 'Cutting Wind',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.setNumber = '86';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Unfezant';
        this.fullName = 'Unfezant BLW';
        this.PREVENT_ALL_MARKER = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_UNFEZANT';
        this.CLEAR_PREVENT_ALL_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_UNFEZANT';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Fly
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    effect.damage = 0;
                }
                else {
                    player.active.marker.addMarker(this.PREVENT_ALL_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_MARKER, this);
                }
            });
        }
        // Prevent all damage and effects
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.AddSpecialConditionsEffect)
            && effect.target.cards.includes(this)
            && effect.target.marker.hasMarker(this.PREVENT_ALL_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        // Cleanup at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_PREVENT_ALL_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PREVENT_ALL_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PREVENT_ALL_MARKER, this);
            });
        }
        return state;
    }
}
exports.Unfezant = Unfezant;
