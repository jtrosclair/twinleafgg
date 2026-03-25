"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidove = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_2 = require("../../game");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidove extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Emergency Evolution',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon\'s remaining HP is 30 or less, you may search your deck for an Unfezant or Unfezant ex and put it onto this Pidove to evolve it. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Gust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'TEF';
        this.setNumber = '133';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Pidove';
        this.fullName = 'Pidove TEF';
    }
    reduceEffect(store, state, effect) {
        // Emergency Evolution
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.forEachPokemon(game_2.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                    if (checkHpEffect.hp - cardList.damage > 30) {
                        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                    }
                    let cards = [];
                    return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, name: 'Unfezant' }, { min: 0, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        if (cards) {
                            player.deck.moveCardsTo(cards, cardList);
                            cardList.clearEffects();
                            cardList.pokemonPlayedTurn = state.turn;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Pidove = Pidove;
