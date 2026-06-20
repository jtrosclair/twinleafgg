"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shieldon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Shieldon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Antique Shield Fossil';
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Smash',
                cost: [M, C],
                damage: 50,
                text: 'Discard 1 Energy from your opponent\'s Active Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '59';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shieldon';
        this.fullName = 'Shieldon M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-ancient-origins/registeel.ts (Forbidden Iron Hammer)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
        }
        return state;
    }
}
exports.Shieldon = Shieldon;
