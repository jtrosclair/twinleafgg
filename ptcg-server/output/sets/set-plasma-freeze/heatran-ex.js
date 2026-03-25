"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatranEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const plasma_energy_1 = require("../set-plasma-storm/plasma-energy");
class HeatranEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Heat Boiler',
                cost: [R, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If this Pokémon is affected by a Special Condition, this attack does 60 more damage.'
            },
            {
                name: 'Dynamite Press',
                cost: [R, R, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has any Plasma Energy attached to it, this attack does 10 more damage for each damage counter on the Defending Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Heatran-EX';
        this.fullName = 'Heatran-EX PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.specialConditions.length > 0) {
                effect.damage += 60;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasPlasmaEnergy = player.active.cards.some(card => card instanceof plasma_energy_1.PlasmaEnergy);
            if (hasPlasmaEnergy) {
                const damageCounters = Math.floor(opponent.active.damage / 10);
                effect.damage += damageCounters * 10;
            }
        }
        return state;
    }
}
exports.HeatranEx = HeatranEx;
