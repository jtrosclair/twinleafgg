"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lapras extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.hp = 130;
        this.cardType = game_1.CardType.WATER;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ferry Across',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Ice Beam',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 80,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Lapras';
        this.fullName = 'Lapras 30C';
    }
    reduceEffect(store, state, effect) {
        // Ferry Across
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: true }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards, sourceCard: this });
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        // Ice Beam
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Lapras = Lapras;
