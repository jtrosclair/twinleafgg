"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Mewtwo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Empower',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Attach up to 2 Basic Energy cards from your discard pile to 1 of your Pokémon.'
            },
            {
                name: 'Psydrive',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Mewtwo';
        this.fullName = 'Mewtwo 30C';
        this.usSetNumber = '30C 63';
    }
    reduceEffect(store, state, effect) {
        // Empower
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON)(store, state, effect.player, 2, undefined, { energyFilter: { energyType: card_types_1.EnergyType.BASIC }, min: 0, allowCancel: true });
        }
        // Psydrive
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Mewtwo = Mewtwo;
