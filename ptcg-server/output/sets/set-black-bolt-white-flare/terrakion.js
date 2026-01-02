"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Terrakion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Retaliate',
                cost: [F, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 80 more damage.'
            },
            {
                name: 'Land Crush',
                cost: [F, F, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion SV11W';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.Terrakion = Terrakion;
