"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidStrikeUrshifu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RapidStrikeUrshifu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Slashing Claw',
                cost: [C],
                damage: 40,
                text: ''
            },
            {
                name: 'Rapid-Fisted Rush',
                cost: [W, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your Rapid Strike Pokémon in play.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Rapid Strike Urshifu';
        this.fullName = 'Rapid Strike Urshifu CRE';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let rapidStrikePokemonCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.tags.includes(card_types_1.CardTag.RAPID_STRIKE)) {
                    rapidStrikePokemonCount++;
                }
            });
            effect.damage = rapidStrikePokemonCount * 30;
        }
        return state;
    }
}
exports.RapidStrikeUrshifu = RapidStrikeUrshifu;
