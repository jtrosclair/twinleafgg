"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Durant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Durant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bite Together',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'If Durant is on your Bench, this attack does 20 more damage.'
            }, {
                name: 'Vice Grip',
                cost: [M, C],
                damage: 50,
                text: ''
            }];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Durant';
        this.fullName = 'Durant WHT';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let isDurantInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Durant' && cardList !== player.active) {
                    isDurantInPlay = true;
                }
            });
            if (isDurantInPlay) {
                effect.damage += 20;
            }
            return state;
        }
        return state;
    }
}
exports.Durant = Durant;
