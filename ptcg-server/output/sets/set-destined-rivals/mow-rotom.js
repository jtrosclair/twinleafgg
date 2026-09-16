"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MowRotom = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MowRotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Trimming Mower',
                cost: [G],
                damage: 0,
                text: 'Discard a Stadium in play.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mow Rotom';
        this.fullName = 'Mow Rotom DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, owner.discard, { cards: [stadiumCard], sourceCard: this, sourceEffect: this.attacks[0] });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let toolCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                toolCount += cardList.tools.length;
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.MowRotom = MowRotom;
