"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Virizion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Virizion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Draw',
                cost: [G],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Leaf Wallop',
                cost: [G, G, C],
                damage: 40,
                damageCalculation: '+',
                text: 'During your next turn, this Pokémon\'s Leaf Wallop attack does 40 more damage (before applying Weakness and Resistance).'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Virizion';
        this.fullName = 'Virizion NVI';
        this.LEAF_WALLOP_MARKER = 'LEAF_WALLOP_MARKER';
        this.LEAF_WALLOP_CLEAR_MARKER = 'LEAF_WALLOP_CLEAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Double Draw
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.DRAW_CARDS)(player, 2);
        }
        // Leaf Wallop
        // Refs: set-boundaries-crossed/watchog.ts (Psych Up), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
        (0, prefabs_1.NEXT_TURN_ATTACK_BONUS)(effect, {
            attack: this.attacks[1],
            source: this,
            bonusDamage: 40,
            bonusMarker: this.LEAF_WALLOP_MARKER,
            clearMarker: this.LEAF_WALLOP_CLEAR_MARKER
        });
        return state;
    }
}
exports.Virizion = Virizion;
