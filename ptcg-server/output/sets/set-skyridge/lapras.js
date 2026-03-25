"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lapras = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Lapras extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Assist',
                cost: [C, C],
                damage: 0,
                text: 'Search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Hypnoblast',
                cost: [W, W, C],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            }];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Lapras';
        this.fullName = 'Lapras SK';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { min: 0, max: 1 }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                cards.forEach(card => (0, prefabs_1.MOVE_CARD_TO)(state, card, player.hand));
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Lapras = Lapras;
