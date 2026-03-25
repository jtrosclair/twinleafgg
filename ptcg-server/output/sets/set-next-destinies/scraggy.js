"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Scraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Shed Skin',
                cost: [C],
                damage: 0,
                text: 'Heal 40 damage from this Pokémon.'
            },
            {
                name: 'Lunge',
                cost: [D, D],
                damage: 40,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy NXD';
    }
    reduceEffect(store, state, effect) {
        // Shed Skin
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(40, effect, store, state);
        }
        // Lunge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Scraggy = Scraggy;
