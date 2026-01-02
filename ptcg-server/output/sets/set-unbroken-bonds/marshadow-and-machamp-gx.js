"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarshadowMachampGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class MarshadowMachampGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 270;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Revenge',
                cost: [F, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during their last turn, this attack does 90 more damage.'
            },
            {
                name: 'Hundred-Blows Impact',
                cost: [F, F, C],
                damage: 160,
                text: ''
            },
            {
                name: 'Acme of Heroism-GX',
                cost: [F, F, C],
                damage: 200,
                gxAttack: true,
                text: 'If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), and if it would be Knocked Out by damage from an opponent\'s attack during their next turn, it is not Knocked Out, and its remaining HP becomes 10. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marshadow & Machamp-GX';
        this.fullName = 'Marshadow & Machamp-GX UNB';
        this.ACME_OF_HEROSIM_MARKER = 'ACME_OF_HEROSIM_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Revenge
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.marker.hasMarker(marker_constants_1.MarkerConstants.REVENGE_MARKER)) {
                effect.damage += 90;
            }
        }
        // Acme of Heroism-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            const extraEffectCost = [F, F, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                player.active.marker.addMarker(this.ACME_OF_HEROSIM_MARKER, this);
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && effect.target.marker.hasMarker(this.ACME_OF_HEROSIM_MARKER, this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.damage >= checkHpEffect.hp) {
                effect.preventDefault = true;
                effect.target.damage = checkHpEffect.hp - 10;
            }
        }
        return state;
    }
}
exports.MarshadowMachampGX = MarshadowMachampGX;
