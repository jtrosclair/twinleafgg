"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioMelmetalGX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LucarioMelmetalGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_GX, game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 260;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Steel Fist',
                cost: [C, C],
                damage: 50,
                text: 'Search your deck for a [M] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Heavy Impact',
                cost: [M, M, C, C],
                damage: 150,
                text: ''
            },
            {
                name: 'Full Metal Wall-GX',
                cost: [C],
                damage: 0,
                gxAttack: true,
                text: 'For the rest of this game, your [M] Pokémon take 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance). If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), discard all Energy from your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.setNumber = '120';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lucario & Melmetal-GX';
        this.fullName = 'Lucario & Melmetal-GX UNB';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Steel Fist
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Metal Energy' }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.active);
                }
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        // Full Metal Wall-GX
        if (prefabs_1.WAS_ATTACK_USED(effect, 2, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            player.usedFullMetalWall = true;
            const extraEffectCost = [C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
                state = store.reduceEffect(state, opponentEnergy);
                const oppCards = [];
                opponentEnergy.energyMap.forEach(em => {
                    oppCards.push(em.card);
                });
                const discardEnergy2 = new attack_effects_1.DiscardCardsEffect(effect, oppCards);
                discardEnergy2.target = opponent.active;
                store.reduceEffect(state, discardEnergy2);
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === game_1.CardType.METAL && effect.opponent.usedFullMetalWall === true) {
            effect.damage -= 30;
        }
        return state;
    }
}
exports.LucarioMelmetalGX = LucarioMelmetalGX;
