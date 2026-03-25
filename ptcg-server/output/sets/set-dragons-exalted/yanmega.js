"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanmega = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanmega extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yanma';
        this.cardType = G;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Agility',
                cost: [C, C],
                damage: 30,
                text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
            },
            {
                name: 'Cutting Wind',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yanmega';
        this.fullName = 'Yanmega DRX';
        this.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'YANMEGA_PREVENT_ALL_MARKER';
        this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'YANMEGA_CLEAR_PREVENT_ALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Agility - flip coin, if heads prevent all effects of attacks
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    player.active.marker.addMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
                    opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
                }
            });
        }
        // Prevent all effects of attacks, including damage
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.AddSpecialConditionsEffect)
            && effect.target.cards.includes(this)
            && effect.target.marker.hasMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
            effect.preventDefault = true;
            return state;
        }
        // Remove marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
            });
        }
        return state;
    }
}
exports.Yanmega = Yanmega;
