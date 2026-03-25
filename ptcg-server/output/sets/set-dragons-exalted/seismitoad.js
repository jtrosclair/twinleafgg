"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seismitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Echoed Voice',
                cost: [C, C, C],
                damage: 50,
                text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Drain Punch',
                cost: [W, C, C, C],
                damage: 80,
                text: 'Heal 20 damage from this Pokémon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad DRX';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // Echoed Voice - next turn bonus
        (0, prefabs_1.NEXT_TURN_ATTACK_BONUS)(effect, {
            attack: this.attacks[0],
            source: this,
            bonusDamage: 50,
            bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
            clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
        });
        // Drain Punch - heal 20
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Seismitoad = Seismitoad;
