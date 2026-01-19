"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riolu2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Riolu2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Punch',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            },
            {
                name: 'Reckless Charge',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'This Pokémon also does 20 damage to itself.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Riolu';
        this.fullName = 'Riolu2 SVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Riolu2 = Riolu2;
