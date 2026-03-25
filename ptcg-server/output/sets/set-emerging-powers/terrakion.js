"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Terrakion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Boulder Crush',
                cost: [F, C],
                damage: 40,
                text: ''
            },
            {
                name: 'Sacred Sword',
                cost: [F, F, C],
                damage: 100,
                text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion EPO';
        this.SACRED_SWORD_MARKER = 'TERRAKION_SACRED_SWORD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (player.active.marker.hasMarker(this.SACRED_SWORD_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.active.marker.addMarker(this.SACRED_SWORD_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.removeMarker(this.SACRED_SWORD_MARKER, this);
        }
        return state;
    }
}
exports.Terrakion = Terrakion;
