"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kadabra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kadabra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Abra';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psychic',
                cost: [P],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.',
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Kadabra';
        this.fullName = 'Kadabra TWM';
    }
    reduceEffect(store, state, effect) {
        // Psychic
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 30;
        }
        return state;
    }
}
exports.Kadabra = Kadabra;
