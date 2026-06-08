"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chesnaught = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const state_1 = require("../../game/store/state/state");
class Chesnaught extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Quilladin';
        this.hp = 180;
        this.cardType = G;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Needle Armor',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is in play, whenever this Pokemon is damaged by an attack from your opponent\'s Active Pokemon, put 3 damage counters on the Attacking Pokemon for each [G] Energy attached to this Pokemon.'
            }];
        this.attacks = [{
                name: 'Impound',
                cost: [G, G, C],
                damage: 160,
                text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.usSetNumber = 'POR 7';
        this.name = 'Chesnaught';
        this.fullName = 'Chesnaught M4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const targetOwner = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage > 0 && targetOwner !== effect.player && state.phase === state_1.GamePhase.ATTACK && effect.attackEffect) {
                const attackingPokemon = effect.source;
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(targetOwner, effect.target);
                store.reduceEffect(state, checkEnergy);
                let gCount = 0;
                checkEnergy.energyMap.forEach(em => {
                    em.provides.forEach(p => {
                        if (p === G || p === card_types_1.CardType.ANY)
                            gCount++;
                    });
                });
                if (gCount > 0 && attackingPokemon) {
                    const putCounters = new attack_effects_2.PutCountersEffect(effect.attackEffect, 30 * gCount);
                    putCounters.target = attackingPokemon;
                    store.reduceEffect(state, putCounters);
                }
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_2.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_2.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Chesnaught = Chesnaught;
