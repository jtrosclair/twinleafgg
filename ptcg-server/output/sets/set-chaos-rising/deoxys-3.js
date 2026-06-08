"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxys3 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_1 = require("../../game/store/state/state");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Deoxys3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.PSY_PROTECT_MARKER = 'DEOXYS3_PSY_PROTECT_MARKER';
        this.CLEAR_PSY_PROTECT_MARKER = 'DEOXYS3_CLEAR_PSY_PROTECT_MARKER';
        this.attacks = [
            {
                name: 'Psy Protect',
                cost: [P, P, C],
                damage: 80,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokemon from attacks from your opponent\'s Pokemon that have any Abilities.'
            }
        ];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.usSetNumber = 'CRI 33';
        this.name = 'Deoxys';
        this.fullName = 'Deoxys M4 33';
    }
    reduceEffect(store, state, effect) {
        // Attack: Psy Protect - set markers for "during opponent's next turn"
        // Ref: set-steam-siege/seedot.ts (2-marker pattern for opponent's next turn)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PSY_PROTECT_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PSY_PROTECT_MARKER, this);
        }
        // Prevent damage from Pokemon with Abilities (during opponent's next turn)
        // Ref: set-twilight-masquerade/cornerstone-mask-ogerpon-ex.ts (prevent damage from source with ability)
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const defender = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, defender, this)) {
                return state;
            }
            if (!effect.target.marker.hasMarker(this.PSY_PROTECT_MARKER, this)) {
                return state;
            }
            const sourceCard = effect.source.getPokemonCard();
            if (!sourceCard || !sourceCard.powers.some(p => p.powerType === pokemon_types_1.PowerType.ABILITY)) {
                return state;
            }
            effect.damage = 0;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const defender = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, defender, this)) {
                return state;
            }
            if (!effect.target.marker.hasMarker(this.PSY_PROTECT_MARKER, this)) {
                return state;
            }
            const sourceCard = effect.source.getPokemonCard();
            if (!sourceCard || !sourceCard.powers.some(p => p.powerType === pokemon_types_1.PowerType.ABILITY)) {
                return state;
            }
            effect.preventDefault = true;
        }
        // Cleanup at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_PSY_PROTECT_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PSY_PROTECT_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PSY_PROTECT_MARKER, this);
            });
        }
        return state;
    }
}
exports.Deoxys3 = Deoxys3;
