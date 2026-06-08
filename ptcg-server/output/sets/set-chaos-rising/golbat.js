"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golbat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Golbat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zubat';
        this.hp = 80;
        this.cardType = D;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Covert Flight',
                cost: [D],
                damage: 30,
                text: 'During your opponent\'s next turn, this Pokemon does not take damage from attacks by Basic Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.usSetNumber = 'CRI 49';
        this.name = 'Golbat';
        this.fullName = 'Golbat M4';
        this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
            const card = effect.source.getPokemonCard();
            if (card && card.stage === card_types_1.Stage.BASIC) {
                effect.damage = 0;
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
            const card = effect.source.getPokemonCard();
            if (card && card.stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.Golbat = Golbat;
