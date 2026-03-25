"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throh = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Throh extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Scarf Hold',
                cost: [F, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Throh';
        this.fullName = 'Throh EPO';
        this.SCARF_HOLD_MARKER = 'SCARF_HOLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    opponent.active.marker.addMarker(this.SCARF_HOLD_MARKER, this);
                }
            });
        }
        // Block attack if marked
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.SCARF_HOLD_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.SCARF_HOLD_MARKER, this);
        }
        return state;
    }
}
exports.Throh = Throh;
