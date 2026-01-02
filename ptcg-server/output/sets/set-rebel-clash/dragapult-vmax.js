"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragapultVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class DragapultVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Dragapult V';
        this.cardType = P;
        this.hp = 320;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shred',
                cost: [P],
                damage: 60,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Max Phantom',
                cost: [P, P],
                damage: 130,
                text: 'Put 5 damage counters on your opponent\'s Benched Pokémon in any way you like.'
            }
        ];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Dragapult VMAX';
        this.fullName = 'Dragapult VMAX RCL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(5, store, state, effect, [game_1.SlotType.BENCH]);
        }
        return state;
    }
}
exports.DragapultVMAX = DragapultVMAX;
