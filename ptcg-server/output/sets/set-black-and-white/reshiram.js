"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on this Pokemon.'
            },
            {
                name: 'Blue Flare',
                cost: [R, R, C],
                damage: 120,
                text: 'Discard 2 [R] Energy attached to this Pokemon.'
            }
        ];
        this.set = 'BLW';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.damage += effect.player.active.damage;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
