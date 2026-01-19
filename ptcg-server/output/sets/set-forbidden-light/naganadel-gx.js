"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaganadelGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NaganadelGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX, card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = P;
        this.hp = 210;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.evolvesFrom = 'Poipole';
        this.attacks = [
            {
                name: 'Beast Raid',
                cost: [C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each of your Ultra Beasts in play.'
            },
            {
                name: 'Jet Needle',
                cost: [P, C, C],
                damage: 110,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Stinger-GX',
                cost: [C, C, C],
                damage: 0,
                gxAttack: true,
                text: 'Both players shuffle their Prize cards into their decks. Then, each player puts the top 3 cards of their deck face down as their Prize cards. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Naganadel-GX';
        this.fullName = 'Naganadel-GX FLI';
    }
    reduceEffect(store, state, effect) {
        // Beast Raid
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            let ultraBeastsInPlay = 0;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                var _a;
                if ((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                    ultraBeastsInPlay++;
                }
            });
            effect.damage = 20 * ultraBeastsInPlay;
        }
        // Jet Needle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        // Stinger-GX
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 2, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            [player, opponent].forEach(player => {
                (0, prefabs_1.SHUFFLE_PRIZES_INTO_DECK)(store, state, player);
                (0, prefabs_1.DRAW_CARDS_AS_FACE_DOWN_PRIZES)(player, 3);
            });
        }
        return state;
    }
}
exports.NaganadelGX = NaganadelGX;
