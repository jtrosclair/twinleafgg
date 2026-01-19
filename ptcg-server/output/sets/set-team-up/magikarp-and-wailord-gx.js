"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagikarpWailordGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MagikarpWailordGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 300;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Super Splash',
                cost: [W, W, W, W, W],
                damage: 180,
                text: ''
            },
            {
                name: 'Towering Splash-GX',
                cost: [W],
                damage: 10,
                gxAttack: true,
                text: 'If this Pokémon has at least 7 extra [W] Energy attached to it (in addition to this attack\'s cost), this attack does 100 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'TEU';
        this.setNumber = '160';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magikarp & Wailord-GX';
        this.fullName = 'Magikarp & Wailord-GX TEU';
    }
    reduceEffect(store, state, effect) {
        // Towering Splash-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            const extraEffectCost = [W, W, W, W, W, W, W, W];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                    if (card !== opponent.active) {
                        const damage = new attack_effects_1.PutDamageEffect(effect, 100);
                        damage.target = card;
                        store.reduceEffect(state, damage);
                    }
                });
            }
        }
        return state;
    }
}
exports.MagikarpWailordGX = MagikarpWailordGX;
