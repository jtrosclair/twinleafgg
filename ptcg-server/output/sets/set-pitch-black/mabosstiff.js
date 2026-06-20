"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mabosstiff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mabosstiff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Maschiff';
        this.cardType = D;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Bite',
                cost: [D, D],
                damage: 60,
                text: '',
            },
            {
                name: 'Diving Headbutt',
                cost: [D, D, D],
                damage: 210,
                text: 'During your opponent\'s next turn, this Pokémon takes 100 extra damage from attacks from your opponent\'s Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '56';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mabosstiff';
        this.fullName = 'Mabosstiff M5';
        this.DIVING_DEBUFF_MARKER = 'M5_MABOSTIFF_DIVING';
        this.CLEAR_DIVING_MARKER = 'M5_MABOSTIFF_CLEAR_DIVING';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.DIVING_DEBUFF_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DIVING_MARKER, this);
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && state.phase === game_1.GamePhase.ATTACK
            && effect.target.marker.hasMarker(this.DIVING_DEBUFF_MARKER, this)) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.player !== defenderOwner) {
                effect.damage += 100;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_DIVING_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DIVING_MARKER, this);
            const opp = game_1.StateUtils.getOpponent(state, effect.player);
            opp.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => cardList.marker.removeMarker(this.DIVING_DEBUFF_MARKER, this));
        }
        return state;
    }
}
exports.Mabosstiff = Mabosstiff;
