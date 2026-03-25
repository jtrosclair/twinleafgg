"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
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
                text: 'Does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Blue Flare',
                cost: [R, R, C],
                damage: 120,
                text: 'Discard 2 [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram NXD 21';
    }
    reduceEffect(store, state, effect) {
        // Outrage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const damageCounters = Math.floor(player.active.damage / 10);
            effect.damage += damageCounters * 10;
        }
        // Blue Flare
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
