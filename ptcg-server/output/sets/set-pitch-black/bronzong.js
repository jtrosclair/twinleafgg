"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.cardType = M;
        this.hp = 130;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Gentle Slap',
                cost: [M],
                damage: 40,
                text: '',
            },
            {
                name: 'Metal Block',
                cost: [M, M, C],
                damage: 120,
                text: 'During your opponent\'s next turn, this Pokémon takes 100 less damage from attacks from your opponent\'s Evolution Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '62';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong M5';
        this.METAL_BLOCK_MARKER = 'M5_BRONZONG_METALBLOCK';
        this.CLEAR_METAL_BLOCK_MARKER = 'M5_BRONZONG_CLEAR_METALBLOCK';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opp = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.METAL_BLOCK_MARKER, this);
            opp.marker.addMarker(this.CLEAR_METAL_BLOCK_MARKER, this);
        }
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect)
            && state.phase === game_1.GamePhase.ATTACK
            && effect.target.marker.hasMarker(this.METAL_BLOCK_MARKER, this)) {
            const defenderOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.player === defenderOwner) {
                return state;
            }
            const source = effect.source.getPokemonCard();
            if (source && source.stage !== card_types_1.Stage.BASIC && effect.damage > 0) {
                effect.damage = Math.max(0, effect.damage - 100);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_METAL_BLOCK_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_METAL_BLOCK_MARKER, this);
            const opp = game_1.StateUtils.getOpponent(state, effect.player);
            opp.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => cardList.marker.removeMarker(this.METAL_BLOCK_MARKER, this));
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
