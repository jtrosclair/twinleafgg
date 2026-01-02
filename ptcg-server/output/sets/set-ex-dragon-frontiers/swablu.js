"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swablu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Swablu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = W;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Splash About',
                cost: [W],
                damage: 10,
                damageCalculation: '+',
                text: 'If Swablu has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage.'
            }];
        this.set = 'DF';
        this.name = 'Swablu';
        this.fullName = 'Swablu DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
exports.Swablu = Swablu;
