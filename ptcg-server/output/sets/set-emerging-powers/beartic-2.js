"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beartic2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Beartic2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cubchoo';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Sheer Cold',
                cost: [W, C, C],
                damage: 50,
                text: 'The Defending Pokémon can\'t attack during your opponent\'s next turn.'
            },
            {
                name: 'Icicle Crash',
                cost: [W, W, C, C],
                damage: 80,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Beartic';
        this.fullName = 'Beartic EPO 30';
        this.SHEER_COLD_MARKER = 'SHEER_COLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.SHEER_COLD_MARKER, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        // Block attack if marked
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.SHEER_COLD_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.SHEER_COLD_MARKER, this);
        }
        return state;
    }
}
exports.Beartic2 = Beartic2;
