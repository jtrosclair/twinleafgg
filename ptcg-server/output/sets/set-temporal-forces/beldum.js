"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beldum = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Beldum extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 70;
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dig Claws',
                cost: [card_types_1.CardType.METAL],
                damage: 10,
                text: ''
            },
            {
                name: 'Iron Tackle',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'This Pokémon also does 10 damage to itself.'
            },
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Beldum';
        this.fullName = 'Beldum TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            // Legacy implementation:
            // - Created DealDamageEffect for 10 and targeted player.active directly.
            //
            // Converted to prefab version (THIS_POKEMON_DOES_DAMAGE_TO_ITSELF).
            return (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Beldum = Beldum;
