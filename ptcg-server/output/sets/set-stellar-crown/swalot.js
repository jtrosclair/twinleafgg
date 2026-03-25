"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swalot = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Swalot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gulpin';
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Devouring Mouth',
                cost: [D],
                damage: 10,
                damageCalculation: '+',
                text: 'If this Pokémon has more Energy attached than your opponent\'s Active Pokémon, this attack does 160 more damage.'
            },
            {
                name: 'Venomous Hit',
                cost: [D, D, C],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Swalot';
        this.fullName = 'Swalot SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            if (playerEnergyCount > opponentEnergyCount) {
                effect.damage += 160;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Swalot = Swalot;
