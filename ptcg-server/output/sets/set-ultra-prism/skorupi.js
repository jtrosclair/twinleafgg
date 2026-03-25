"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skorupi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skorupi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.HONE_CLAWS_MARKER = 'SKORUPI_UPR_HONE_CLAWS_MARKER';
        this.HONE_CLAWS_CLEAR_MARKER = 'SKORUPI_UPR_HONE_CLAWS_CLEAR_MARKER';
        this.attacks = [
            {
                name: 'Hone Claws',
                cost: [P],
                damage: 0,
                text: 'During your next turn, this Pokémon\'s Pierce attack\'s base damage is 90.'
            },
            {
                name: 'Pierce',
                cost: [P, P],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skorupi';
        this.fullName = 'Skorupi UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Hone Claws
        // Ref: set-burning-shadows/sneasel.ts (Hone Claws - NEXT_TURN_ATTACK_BASE_DAMAGE)
        (0, prefabs_1.NEXT_TURN_ATTACK_BASE_DAMAGE)(effect, {
            setupAttack: this.attacks[0],
            boostedAttack: this.attacks[1],
            source: this,
            baseDamage: 90,
            bonusMarker: this.HONE_CLAWS_MARKER,
            clearMarker: this.HONE_CLAWS_CLEAR_MARKER
        });
        return state;
    }
}
exports.Skorupi = Skorupi;
