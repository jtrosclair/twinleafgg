"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cradily = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cradily extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lileep';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Lifesplosion',
                cost: [G],
                damage: 0,
                text: 'For each Energy attached to this Pokémon, search your deck for a Stage 2 Pokémon and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Spiral Drain',
                cost: [G, C, C],
                damage: 60,
                text: 'Heal 20 dmaage from this Pokémon.'
            }
        ];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Cradily';
        this.fullName = 'Cradily PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.length;
            }, 0);
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.STAGE_2 }, { min: 0, max: totalEnergy });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        return state;
    }
}
exports.Cradily = Cradily;
