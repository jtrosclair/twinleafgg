"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gurdurr2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gurdurr2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Timburr';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Focus Energy',
                cost: [C],
                damage: 0,
                text: 'During your next turn, each of this Pokémon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Low Sweep',
                cost: [F, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Gurdurr';
        this.fullName = 'Gurdurr BLW 60';
        this.FOCUS_ENERGY_MARKER = 'FOCUS_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Focus Energy - add marker for damage boost next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.FOCUS_ENERGY_MARKER, this);
        }
        // Apply Focus Energy bonus damage
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            if (effect.player.active.marker.hasMarker(this.FOCUS_ENERGY_MARKER, this)) {
                effect.damage += 40;
                // Remove the marker after applying (only applies once)
                effect.player.active.marker.removeMarker(this.FOCUS_ENERGY_MARKER, this);
            }
        }
        // Clean up markers at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.active.marker.removeMarker(this.FOCUS_ENERGY_MARKER, this);
        }
        return state;
    }
}
exports.Gurdurr2 = Gurdurr2;
