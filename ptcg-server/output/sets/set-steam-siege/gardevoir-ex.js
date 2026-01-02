"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class GardevoirEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Link Blast',
                cost: [Y, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokémon and your opponent\'s Active Pokémon have the same amount of Energy attached to them, this attack does 70 more damage.'
            }, {
                name: 'Luminous Blade',
                cost: [Y, Y, C],
                damage: 120,
                text: 'Discard an Energy attached to this Pokémon.'
            },
        ];
        this.set = 'STS';
        this.name = 'Gardevoir-EX';
        this.fullName = 'Gardevoir EX STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
    }
    reduceEffect(store, state, effect) {
        // Link Blast
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const playerActiveEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard);
            const opponentActiveEnergy = opponent.active.cards.filter(card => card instanceof game_1.EnergyCard);
            if (playerActiveEnergy.length === opponentActiveEnergy.length) {
                effect.damage += 70;
            }
        }
        // Shining Wind
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.GardevoirEx = GardevoirEx;
