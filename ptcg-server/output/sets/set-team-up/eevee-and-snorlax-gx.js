"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EeveeSnorlaxGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EeveeSnorlaxGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 270;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Cheer Up',
                cost: [C],
                damage: 0,
                text: 'Attach an Energy card from your hand to 1 of your Pokémon.'
            },
            {
                name: 'Dump Truck Press',
                cost: [C, C, C, C],
                damage: 120,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 120 more damage.'
            },
            {
                name: 'Megaton Friends-GX',
                cost: [C, C, C, C],
                damage: 210,
                gxAttack: true,
                text: 'If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), draw cards until you have 10 cards in your hand. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'TEU';
        this.setNumber = '120';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eevee & Snorlax-GX';
        this.fullName = 'Eevee & Snorlax-GX TEU';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        // Cheer Up
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        // Dump Truck Press
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            if (((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) !== game_1.Stage.BASIC
                || ((_b = opponent.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) !== game_1.Stage.LEGEND
                || ((_c = opponent.active.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.stage) !== game_1.Stage.VUNION) {
                effect.damage += 120;
            }
        }
        // Megaton Friends-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            const extraEffectCost = [C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                if (player.hand.cards.length > 10) {
                    return state;
                }
                const cardsToDraw = 10 - player.hand.cards.length;
                for (let i = 0; i < cardsToDraw; i++) {
                    prefabs_1.DRAW_CARDS(player, 1);
                }
            }
        }
        return state;
    }
}
exports.EeveeSnorlaxGX = EeveeSnorlaxGX;
