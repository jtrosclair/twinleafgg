"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolkloresLucarioex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FolkloresLucarioex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Forge',
                cost: [C],
                damage: 0,
                text: 'Attach 1 [F] Energy or 1 [M] Energy from your hand to Folklore\'s Lucario ex.'
            },
            {
                name: 'Linear Attack',
                cost: [F, C],
                damage: 0,
                text: 'Does 30 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Extra Claws',
                cost: [M, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Pokémon-ex, this attack does 20 more damage.'
            }];
        this.set = 'GBM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Folklore\'s Lucario ex';
        this.fullName = 'Folklore\'s Lucario ex GBM';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const blocked = [];
            player.hand.cards.forEach((c, i) => {
                if (!(c instanceof game_1.EnergyCard))
                    blocked.push(i);
                else if (!c.provides.includes(card_types_1.CardType.FIGHTING) && !c.provides.includes(card_types_1.CardType.METAL))
                    blocked.push(i);
            });
            const hasFightingOrMetalEnergyInHand = player.hand.cards.some(c => c instanceof game_1.EnergyCard && (c.provides.includes(card_types_1.CardType.FIGHTING) || c.provides.includes(card_types_1.CardType.METAL)));
            if (!hasFightingOrMetalEnergyInHand) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.hand.moveCardTo(cards[0], player.active);
                }
                return state;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            if ((_a = effect.opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.FolkloresLucarioex = FolkloresLucarioex;
