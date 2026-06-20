"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trumbeak = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trumbeak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikipek';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fly',
                cost: [C],
                damage: 30,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage and effects of attacks done to this Pokémon. If tails, this attack fails.',
            }];
        this.set = 'M5';
        this.setNumber = '65';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Trumbeak';
        this.fullName = 'Trumbeak M5';
        this.FLY_MARKER = 'M5_TRUMBEAK_FLY';
        this.CLEAR_FLY_MARKER = 'M5_TRUMBEAK_CLEAR_FLY';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-evolutions/chansey.ts (Scrunch), set-lost-thunder/phanpy.ts (flip tails does nothing with printed damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, heads => {
                if (!heads) {
                    effect.damage = 0;
                    return state;
                }
                player.active.marker.addMarker(this.FLY_MARKER, this);
                opponent.marker.addMarker(this.CLEAR_FLY_MARKER, this);
                return state;
            });
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && effect.target.marker.hasMarker(this.FLY_MARKER, this)) {
            effect.preventDefault = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_FLY_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_FLY_MARKER, this);
            const opp = game_1.StateUtils.getOpponent(state, effect.player);
            opp.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => cardList.marker.removeMarker(this.FLY_MARKER, this));
        }
        return state;
    }
}
exports.Trumbeak = Trumbeak;
