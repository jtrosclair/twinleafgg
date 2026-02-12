"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MukAlolanMukGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MukAlolanMukGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Severe Poison',
                cost: [P, C, C],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 8 damage counters instead of 1 on that Pokémon between turns.'
            },
            {
                name: 'Posion Absorption',
                cost: [P, C, C, C],
                damage: 120,
                text: 'If your opponent\'s Active Pokémon is Poisoned, heal 100 damage from this Pokémon.'
            },
            {
                name: 'Nasty Goo Mix-GX',
                cost: [],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent\'s Active Pokémon is now Paralyzed and Poisoned. If this Pokémon has at least 4 extra Energy attached to it (in addition to this attack\'s cost), put 15 damage counters instead of 1 on that Pokémon between turns. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Muk & Alolan Muk-GX';
        this.fullName = 'Muk & Alolan Muk-GX UNB';
    }
    reduceEffect(store, state, effect) {
        // Severe Poison
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this, 80);
        }
        // Poison Absorption
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (opponent.active.specialConditions.length > 0 && opponent.active.specialConditions.includes(game_1.SpecialCondition.POISONED)) {
                const healing = new attack_effects_1.HealTargetEffect(effect, 100);
                healing.target = player.active;
                store.reduceEffect(state, healing);
            }
        }
        // Nasty Goo Mix-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            let poisonDamage = 10;
            const extraEffectCost = [C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                poisonDamage = 150;
            }
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this, poisonDamage);
        }
        return state;
    }
}
exports.MukAlolanMukGX = MukAlolanMukGX;
