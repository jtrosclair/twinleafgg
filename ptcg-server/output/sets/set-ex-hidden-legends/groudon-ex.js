"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groudonex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Groudonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Mark of Antiquity',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Groudon ex is your Active Pokémon, each player\'s Kyogre ex and Rayquaza ex can\'t attack.'
            }];
        this.attacks = [{
                name: 'Rock Tumble',
                cost: [C, C],
                damage: 30,
                text: 'This attack\'s damage is not affected by Resistance.'
            },
            {
                name: 'Crushing Mantle',
                cost: [F, F, C],
                damage: 50,
                damageCalculation: '+',
                text: 'You may discard from your hand as many Energy cards as you like. If you do, this attack does 50 damage plus 10 more damage for each Energy card you discarded.'
            }];
        this.set = 'HL';
        this.setNumber = '93';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Groudon ex';
        this.fullName = 'Groudon ex HL';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.AttackEffect && (((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Kyogre ex' || ((_b = effect.source.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Rayquaza ex')) {
            if (effect.opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.ignoreResistance = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const energiesInHand = player.hand.cards.filter(card => card instanceof game_1.EnergyCard && card.superType === game_1.SuperType.ENERGY);
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: energiesInHand.length }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                player.hand.moveCardsTo(cards, player.discard);
                effect.damage += cards.length * 10;
                return state;
            });
        }
        return state;
    }
}
exports.Groudonex = Groudonex;
