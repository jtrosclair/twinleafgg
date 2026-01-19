"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Corsola = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Corsola extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Coral Glow',
                cost: [C],
                damage: 0,
                text: 'Draw a number of cards up to the number of your opponent\'s Basic Pokémon in play. (You can\'t have more than 10 cards in your hand in this way.)'
            },
            {
                name: 'Surf',
                cost: [W, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Corsola';
        this.fullName = 'Corsola HL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let cardsToDraw = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                // ex era ruling is that this should mean unevolved
                if (cardList.getPokemons().length === 1 || card.tags.includes(card_types_1.CardTag.LEGEND)) {
                    cardsToDraw++;
                }
            });
            cardsToDraw = Math.min(cardsToDraw, 10 - player.hand.cards.length);
            (0, prefabs_1.DRAW_UP_TO_X_CARDS)(store, state, player, cardsToDraw);
        }
        return state;
    }
}
exports.Corsola = Corsola;
