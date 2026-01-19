"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dottler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dottler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Blipbug';
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Radar',
                cost: [P],
                damage: 0,
                text: 'Look at the top 4 cards of your deck and put them back in any order.'
            },
            {
                name: 'Ram',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Dottler';
        this.fullName = 'Dottler BST';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 4);
            return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                if (order === null) {
                    return state;
                }
                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);
            });
        }
        return state;
    }
}
exports.Dottler = Dottler;
