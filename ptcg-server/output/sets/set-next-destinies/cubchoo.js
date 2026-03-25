"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cubchoo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cubchoo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Sniffle',
                cost: [W],
                damage: 0,
                text: 'During your next turn, this Pokémon\'s Belt attack\'s base damage is 40.'
            },
            {
                name: 'Belt',
                cost: [W, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '36';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cubchoo';
        this.fullName = 'Cubchoo NXD';
        this.SNIFFLE_MARKER = 'SNIFFLE_MARKER';
        this.SNIFFLE_CLEAR_MARKER = 'SNIFFLE_CLEAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Refs: set-jungle/scyther.ts (Swords Dance), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BASE_DAMAGE)
        (0, prefabs_1.NEXT_TURN_ATTACK_BASE_DAMAGE)(effect, {
            setupAttack: this.attacks[0],
            boostedAttack: this.attacks[1],
            source: this,
            baseDamage: 40,
            bonusMarker: this.SNIFFLE_MARKER,
            clearMarker: this.SNIFFLE_CLEAR_MARKER
        });
        return state;
    }
}
exports.Cubchoo = Cubchoo;
