"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialgaG = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DialgaG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Deafen',
                cost: [M, C],
                damage: 10,
                text: 'Your opponent can\'t play any Trainer cards or Stadium cards from his or her hand during your opponent\'s next turn.'
            },
            {
                name: 'Second Strike',
                cost: [M, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has 2 or more damage counters on it, this attack does 50 damage plus 20 more damage.'
            }
        ];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Dialga G';
        this.fullName = 'Dialga G PL';
        this.DEAFEN_MARKER = 'DEAFEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Deafen
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.opponent.marker.addMarker(this.DEAFEN_MARKER, this);
        }
        if ((effect instanceof play_card_effects_1.PlayItemEffect
            || effect instanceof play_card_effects_1.PlayStadiumEffect) && effect.player.marker.hasMarker(this.DEAFEN_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DEAFEN_MARKER, this)) {
            effect.player.marker.removeMarker(this.DEAFEN_MARKER, this);
        }
        // Second Strike
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (effect.opponent.active.damage >= 20) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.DialgaG = DialgaG;
