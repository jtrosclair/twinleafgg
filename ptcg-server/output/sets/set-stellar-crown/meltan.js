"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meltan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meltan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Meltan';
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Knickknack Carrying',
                cost: [M],
                damage: 0,
                text: 'Search your deck for a Pokémon Tool card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Ram',
                cost: [M, C],
                damage: 30,
                text: ''
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.setNumber = '103';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meltan';
        this.fullName = 'Meltan SCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            else {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { min: 0, max: 1, allowCancel: true }), selectedCards => {
                    const cards = selectedCards || [];
                    // Operation canceled by the user
                    if (cards.length === 0) {
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                            return state;
                        });
                    }
                    cards.forEach((card, index) => {
                        player.deck.moveCardTo(card, player.hand);
                    });
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (cards.length > 0) {
                        prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                    }
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                });
            }
        }
        return state;
    }
}
exports.Meltan = Meltan;
