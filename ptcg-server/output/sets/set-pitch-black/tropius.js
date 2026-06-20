"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const card_list_1 = require("../../game/store/state/card-list");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Tropius extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Fruity Scent',
                cost: [C],
                damage: 0,
                text: 'Look at the top 6 cards of your deck. You may reveal any number of Pokémon you find there and put them into your hand. Then, shuffle the remaining cards back into your deck.',
            },
            {
                name: 'Solarbeam',
                cost: [G, C],
                damage: 60,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '1';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tropius';
        this.fullName = 'Tropius M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-shining-fates/manaphy.ts (Ocean Search — top deck to CardList + optional Pokémon picks)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const topCards = new card_list_1.CardList();
            const count = Math.min(6, player.deck.cards.length);
            player.deck.moveTo(topCards, count);
            const looked = [...topCards.cards];
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, looked);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, looked);
            const pokemonInPreview = looked.filter(c => c instanceof pokemon_card_1.PokemonCard).length;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, topCards, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: pokemonInPreview, allowCancel: false }), selected => {
                const pokemonTaken = selected || [];
                if (pokemonTaken.length > 0) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, pokemonTaken);
                    topCards.moveCardsTo(pokemonTaken, player.hand);
                }
                topCards.moveTo(player.deck);
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.Tropius = Tropius;
