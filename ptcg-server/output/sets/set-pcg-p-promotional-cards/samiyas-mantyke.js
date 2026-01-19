"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamiyasMantyke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SamiyasMantyke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Water Sport',
                cost: [W],
                damage: 10,
                damageCalculation: '+',
                text: 'If Samiya\'s Mantyke has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage.'
            },
            {
                name: 'Splash',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'PCGP';
        this.name = 'Samiya\'s Mantyke';
        this.fullName = 'Samiya\'s Mantyke PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            if (playerEnergyCount < opponentEnergyCount) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.SamiyasMantyke = SamiyasMantyke;
