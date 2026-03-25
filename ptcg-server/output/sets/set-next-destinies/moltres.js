"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Searing Flame',
                cost: [R, C, C],
                damage: 50,
                text: 'The Defending Pokémon is now Burned.'
            },
            {
                name: 'Fire Blast',
                cost: [R, C, C, C],
                damage: 90,
                text: 'Discard a [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Moltres';
        this.fullName = 'Moltres NXD';
    }
    reduceEffect(store, state, effect) {
        // Searing Flame
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Fire Blast
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.Moltres = Moltres;
