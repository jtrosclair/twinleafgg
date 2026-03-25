"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steelix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steelix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.cardType = M;
        this.hp = 150;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Metal Defender',
                cost: [M, C, C],
                damage: 50,
                text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
            },
            {
                name: 'Heavy Impact',
                cost: [M, C, C, C, C],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steelix';
        this.fullName = 'Steelix PLF';
        this.METAL_DEFENDER_MARKER = 'STEELIX_METAL_DEFENDER_MARKER';
        this.CLEAR_METAL_DEFENDER_MARKER = 'STEELIX_CLEAR_METAL_DEFENDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Metal Defender - no weakness during opponent's next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.METAL_DEFENDER_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
        }
        // Remove weakness when marker is present
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            if (effect.target.marker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
                effect.weakness = [];
            }
        }
        // Clean up at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_METAL_DEFENDER_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                cardList.marker.removeMarker(this.METAL_DEFENDER_MARKER, this);
            });
        }
        return state;
    }
}
exports.Steelix = Steelix;
