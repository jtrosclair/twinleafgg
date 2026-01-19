"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thievul = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Thievul extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nickit';
        this.cardType = D;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Fumbling Hands',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may have each player shuffle their hand and put it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, each player draws 4 cards.'
            }];
        this.attacks = [{
                name: 'Tail Smack',
                cost: [C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Thievul';
        this.fullName = 'Thievul EVS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.JUST_EVOLVED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckBottom = new game_1.CardList();
            const opponentDeckBottom = new game_1.CardList();
            if (player.hand.cards.length === 0 && opponent.hand.cards.length === 0) {
                return state;
            }
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    this.shufflePlayerHand(player);
                    this.shufflePlayerHand(opponent);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, deckBottom, { sourceCard: this, sourceEffect: this.powers[0] });
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponentDeckBottom, { sourceCard: this, sourceEffect: this.powers[0] });
                    deckBottom.moveTo(player.deck);
                    opponentDeckBottom.moveTo(opponent.deck);
                    (0, prefabs_1.DRAW_CARDS)(player, 4);
                    (0, prefabs_1.DRAW_CARDS)(opponent, 4);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        return state;
    }
    shufflePlayerHand(player) {
        const hand = player.hand.cards;
        // Shuffle the hand using the Fisher-Yates shuffle algorithm
        for (let i = hand.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hand[i], hand[j]] = [hand[j], hand[i]];
        }
    }
}
exports.Thievul = Thievul;
