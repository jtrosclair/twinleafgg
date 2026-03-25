"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Swords Dance',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
            },
            {
                name: 'Slash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Scyther';
        this.fullName = 'Scyther JU';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // Refs: set-next-destinies/cubchoo.ts (Sniffle/Belt), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BASE_DAMAGE)
        (0, prefabs_1.NEXT_TURN_ATTACK_BASE_DAMAGE)(effect, {
            setupAttack: this.attacks[0],
            boostedAttack: this.attacks[1],
            source: this,
            baseDamage: 60,
            bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
            clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
        });
        return state;
    }
}
exports.Scyther = Scyther;
