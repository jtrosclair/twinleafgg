"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaManectricEx = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MegaManectricEx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Electrike';
        this.tags = [card_types_1.CardTag.POKEMON_SV_MEGA, card_types_1.CardTag.POKEMON_ex];
        this.hp = 330;
        this.cardType = L;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [{
                name: 'Flash Ray',
                cost: [L, L],
                damage: 120,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
            },
            {
                name: 'Riot Blast',
                cost: [L, L, L],
                damage: 200,
                damageCalculation: '+',
                text: 'You may discard all Energy attached to this Pokémon. If you do, this attack does 130 more damage.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Mega Manectric ex';
        this.fullName = 'Mega Manectric ex M1S';
        this.regulationMark = 'I';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER) && state.phase === state_1.GamePhase.ATTACK) {
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
                return state;
            }
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    effect.damage += 130;
                    prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
                }
            }, game_1.GameMessage.WANT_TO_DISCARD_ENERGY);
        }
        return state;
    }
}
exports.MegaManectricEx = MegaManectricEx;
