"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanma = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanma extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Free Flight',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'If Yanma has no Energy attached to it, Yanma\'s Retreat Cost is 0.'
            }];
        this.attacks = [{
                name: 'Dive',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TM';
        this.name = 'Yanma';
        this.fullName = 'Yanma TM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length === 0) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.Yanma = Yanma;
