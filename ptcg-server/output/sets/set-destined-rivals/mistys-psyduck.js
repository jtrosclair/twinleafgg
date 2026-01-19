"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysPsyduck = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysPsyduck extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Slapstick Jump',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may discard the bottom card ' +
                    'of your deck. If you do, discard all cards attached to this Pokémon and put it on top of your deck.',
            }];
        this.attacks = [{ name: 'Sprinkle Water', cost: [W], damage: 30, text: '' }];
        this.set = 'DRI';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Misty\'s Psyduck';
        this.fullName = 'Misty\'s Psyduck DRI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.active.cards.includes(this) || opponent.active.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveCardsTo((0, prefabs_1.GET_CARDS_ON_BOTTOM_OF_DECK)(player, 1), player.discard);
            const psyduckCard = cardList.getPokemonCard();
            if (!psyduckCard) {
                return state;
            }
            // Get attached cards (energy, tools, etc.)
            const otherCards = cardList.cards.filter(card => !(card instanceof game_1.PokemonCard) &&
                !cardList.getPokemons().includes(card) &&
                (!cardList.tools || !cardList.tools.includes(card)));
            const tools = [...cardList.tools];
            // Move tools to discard
            if (tools.length > 0) {
                for (const tool of tools) {
                    cardList.moveCardTo(tool, player.discard);
                }
            }
            // Move other cards to discard first
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, cardList, player.discard, { cards: otherCards });
            }
            // Create temporary card list and move Psyduck to top of deck
            const deckTop = new game_1.CardList();
            (0, prefabs_1.MOVE_CARDS)(store, state, cardList, deckTop, { cards: [psyduckCard] });
            (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, player.deck, { toTop: true });
            cardList.clearEffects();
        }
        return state;
    }
}
exports.MistysPsyduck = MistysPsyduck;
