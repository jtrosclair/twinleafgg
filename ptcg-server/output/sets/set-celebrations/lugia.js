"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lugia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lugia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Aero Ball',
                cost: [C, C],
                damage: 0,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Energy attached to both Active Pokémon.'
            },
            {
                name: 'Deep Crush',
                cost: [C, C, C, C],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'D';
        this.set = 'CEL';
        this.name = 'Lugia';
        this.fullName = 'Lugia CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += (playerEnergyCount + opponentEnergyCount) * 20;
        }
        // Deep Crush
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Lugia = Lugia;
