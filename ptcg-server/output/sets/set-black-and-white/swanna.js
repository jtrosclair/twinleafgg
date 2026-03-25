"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swanna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Swanna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ducklett';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Feather Dance',
                cost: [C],
                damage: 0,
                text: 'During your next turn, each of this Pokémon\'s attacks does 40 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Aqua Ring',
                cost: [W, C],
                damage: 40,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Swanna';
        this.fullName = 'Swanna BLW';
        this.FEATHER_DANCE_MARKER = 'FEATHER_DANCE_MARKER';
        this.usedAquaRing = false;
    }
    reduceEffect(store, state, effect) {
        // Feather Dance - add marker for damage boost next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.FEATHER_DANCE_MARKER, this);
        }
        // Apply Feather Dance bonus damage
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            if (effect.player.active.marker.hasMarker(this.FEATHER_DANCE_MARKER, this)) {
                effect.damage += 40;
                // Remove the marker after applying (only applies once)
                effect.player.active.marker.removeMarker(this.FEATHER_DANCE_MARKER, this);
            }
        }
        // Aqua Ring - set flag for post-damage switch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedAquaRing = true;
        }
        // Switch self after Aqua Ring damage
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedAquaRing) {
            const player = effect.player;
            this.usedAquaRing = false;
            if (player.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        // Clean up markers at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            // Remove Feather Dance marker from opponent's turn end (it lasts through opponent's turn)
            opponent.active.marker.removeMarker(this.FEATHER_DANCE_MARKER, this);
            this.usedAquaRing = false;
        }
        return state;
    }
}
exports.Swanna = Swanna;
