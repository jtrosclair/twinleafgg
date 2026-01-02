"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspeonDeoxysGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class EspeonDeoxysGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 260;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Psychic Club',
                cost: [P, C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your Benched [P] Pokémon.'
            },
            {
                name: 'Cross Division-GX',
                cost: [P, C, C],
                damage: 0,
                gxAttack: true,
                text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. If this Pokémon has at least 3 extra Energy attached to it (in addition to this attack\'s cost), put 20 damage counters on them instead. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Espeon & Deoxys-GX';
        this.fullName = 'Espeon & Deoxys-GX UNM';
    }
    reduceEffect(store, state, effect) {
        // Psychic Club
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let psychics = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === game_1.CardType.PSYCHIC) {
                    psychics++;
                }
            });
            effect.damage += psychics * 30;
        }
        // Cross Division-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            let counters = 10;
            const extraEffectCost = [P, C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                counters = 20;
            }
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
        }
        return state;
    }
}
exports.EspeonDeoxysGX = EspeonDeoxysGX;
