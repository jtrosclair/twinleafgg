"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Galvantula extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Discharge',
                cost: [L],
                damage: 0,
                damageCalculation: 'x',
                text: 'Discard all [L] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way.'
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula SV11W';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const lightningEnergies = checkProvidedEnergy.energyMap.filter(e => e.provides.includes(card_types_1.CardType.LIGHTNING));
            const cards = lightningEnergies.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            const totalDiscarded = discardEnergy.cards.length;
            store.reduceEffect(state, discardEnergy);
            effect.damage = totalDiscarded * 50;
        }
        return state;
    }
}
exports.Galvantula = Galvantula;
