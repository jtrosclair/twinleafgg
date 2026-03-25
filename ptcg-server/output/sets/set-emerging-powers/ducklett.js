"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ducklett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Ducklett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Roost',
                cost: [C],
                damage: 0,
                text: 'Heal 40 damage from this Pokémon. This Pokémon can\'t retreat during your next turn.'
            },
            {
                name: 'Rain Splash',
                cost: [W, W],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett EPO';
        this.ROOST_MARKER = 'ROOST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(40, effect, store, state);
            player.active.marker.addMarker(this.ROOST_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.ROOST_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.removeMarker(this.ROOST_MARKER, this);
        }
        return state;
    }
}
exports.Ducklett = Ducklett;
