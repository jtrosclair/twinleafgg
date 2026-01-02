"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLopunnyJigglypuffGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class MegaLopunnyJigglypuffGX extends game_1.PokemonCard {
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
                name: 'Jumping Balloon',
                cost: [C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 60 more damage for each of your opponent\'s Pokémon-GX and Pokémon-EX in play. '
            },
            {
                name: 'Puffy Smashers-GX',
                cost: [C],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent\'s Active Pokémon is now Asleep. If this Pokémon has at least 4 extra Energy attached to it (in addition to this attack\'s cost), this attack does 200 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CEC';
        this.setNumber = '165';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Lopunny & Jigglypuff-GX';
        this.fullName = 'Mega Lopunny & Jigglypuff-GX CEC';
    }
    reduceEffect(store, state, effect) {
        // Jumping Balloon
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            let gxsAndExs = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a, _b;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(game_1.CardTag.POKEMON_EX)) || ((_b = card.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(game_1.CardTag.POKEMON_GX))) {
                    gxsAndExs++;
                }
            });
            effect.damage += 60 * gxsAndExs;
        }
        // Puffy Smashers-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
            const extraEffectCost = [C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(200, effect, store, state);
            }
        }
        return state;
    }
}
exports.MegaLopunnyJigglypuffGX = MegaLopunnyJigglypuffGX;
