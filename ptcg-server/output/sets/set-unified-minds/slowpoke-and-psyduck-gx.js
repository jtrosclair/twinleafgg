"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowpokePsyduckGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SlowpokePsyduckGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 250;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Ditch and Splash',
                cost: [W, W],
                damage: 40,
                damageCalculation: 'x',
                text: 'Discard any number of Supporter cards from your hand. This attack does 40 damage for each card you discarded in this way.'
            },
            {
                name: 'Thrilling Times-GX',
                cost: [W, W],
                damage: 10,
                damageCalculation: '+',
                gxAttack: true,
                text: 'Flip a coin. If heads, this attack does 100 more damage. If this Pokémon has at least 6 extra [W] Energy attached to it (in addition to this attack\'s cost), flip 10 coins instead, and this attack does 100 more damage for each heads. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Slowpoke & Psyduck-GX';
        this.fullName = 'Slowpoke & Psyduck-GX UNM';
    }
    reduceEffect(store, state, effect) {
        // Ditch and Splash
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 0 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discardSupporters = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardSupporters.target = player.active;
                store.reduceEffect(state, discardSupporters);
                player.hand.moveCardsTo(cards, player.discard);
                effect.damage = cards.length * 40;
                return state;
            });
        }
        // Thrilling Times-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            let coinFlips = 1;
            const extraEffectCost = [W, W, W, W, W, W, W, W];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                coinFlips = 10;
            }
            let heads = 0;
            for (let i = 0; i < coinFlips; i++) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        heads++;
                    }
                });
            }
            effect.damage = heads * 100;
        }
        return state;
    }
}
exports.SlowpokePsyduckGX = SlowpokePsyduckGX;
