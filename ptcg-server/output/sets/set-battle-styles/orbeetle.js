"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orbeetle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Orbeetle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dottler';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Evomancy',
                cost: [C],
                damage: 0,
                text: 'For each Energy attached to this Pokémon, search your deck for a Stage 2 Pokémon, except Orbeetle, and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Zen Headbutt',
                cost: [P, C, C],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Orbeetle';
        this.fullName = 'Orbeetle BST';
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
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name === 'Orbeetle') {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: card_types_1.Stage.STAGE_2 }, { min: 0, max: totalEnergy, blocked });
        }
        return state;
    }
}
exports.Orbeetle = Orbeetle;
