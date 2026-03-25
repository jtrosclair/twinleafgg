"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirlia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kirlia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ralts';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smack',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Psychic',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 10 more damage for each Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kirlia';
        this.fullName = 'Kirlia NXD';
    }
    reduceEffect(store, state, effect) {
        // Psychic
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 10;
        }
        return state;
    }
}
exports.Kirlia = Kirlia;
