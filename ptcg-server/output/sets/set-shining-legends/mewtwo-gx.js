"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class MewtwoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = P;
        this.hp = 190;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Full Burst',
                cost: [P],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the amount of Energy attached to this Pokémon.'
            },
            {
                name: 'Super Absorption',
                cost: [P, C],
                damage: 60,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Psystrike-GX',
                cost: [P, P, P],
                damage: 200,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'SLG';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mewtwo-GX';
        this.fullName = 'Mewtwo-GX SLG';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = playerEnergyCount * 30;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const player = effect.player;
            // Check if player has used GX attack
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            // set GX attack as used for game
            player.usedGX = true;
            attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 200);
        }
        return state;
    }
}
exports.MewtwoGX = MewtwoGX;
