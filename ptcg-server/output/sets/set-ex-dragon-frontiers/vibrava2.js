"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vibrava2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Vibrava2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trapinch';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Psychic Wing',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Vibrava has any [P] Energy attached to it, the Retreat Cost for Vibrava is 0.'
            }];
        this.attacks = [{
                name: 'Quick Blow',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Vibrava';
        this.fullName = 'Vibrava DF 24';
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
            // Check if there is any Water energy attached
            const hasPsychicEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.PSYCHIC) || energy.provides.includes(card_types_1.CardType.ANY));
            if (hasPsychicEnergy) {
                effect.cost = [];
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        return state;
    }
}
exports.Vibrava2 = Vibrava2;
