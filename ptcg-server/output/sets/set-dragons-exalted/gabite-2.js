"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gabite2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Gabite2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gible';
        this.cardType = N;
        this.hp = 80;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Shred',
                cost: [W, F],
                damage: 40,
                text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gabite';
        this.fullName = 'Gabite DRX 88';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-plasma-blast/druddigon.ts (Shred)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 40);
        }
        return state;
    }
}
exports.Gabite2 = Gabite2;
