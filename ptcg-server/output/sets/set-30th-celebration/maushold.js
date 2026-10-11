"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maushold = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Maushold extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tandemaus';
        this.hp = 80;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Gnaw Together',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin for each Maushold you have in play. For each heads, discard the top 2 cards of your opponent\'s deck.'
            },
            {
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Maushold';
        this.fullName = 'Maushold 30C';
    }
    reduceEffect(store, state, effect) {
        // Gnaw Together
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let mausholdCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
                if (card.name === 'Maushold') {
                    mausholdCount += 1;
                }
            });
            if (mausholdCount === 0) {
                return state;
            }
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, mausholdCount, results => {
                const heads = results.filter(r => r).length;
                for (let i = 0; i < heads; i++) {
                    (0, prefabs_1.DISCARD_TOP_X_OF_OPPONENTS_DECK)(store, state, player, 2, this, effect);
                }
            });
        }
        return state;
    }
}
exports.Maushold = Maushold;
