"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klang = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Klang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Klink';
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Metal Sound',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Confused.'
            },
            {
                name: 'Guard Press',
                cost: [M, M, C],
                damage: 60,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Klang';
        this.fullName = 'Klang EPO';
        this.GUARD_PRESS_MARKER = 'GUARD_PRESS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.marker.addMarker(this.GUARD_PRESS_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.GUARD_PRESS_MARKER, this)) {
            effect.damage = Math.max(0, effect.damage - 20);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.GUARD_PRESS_MARKER, this);
        }
        return state;
    }
}
exports.Klang = Klang;
