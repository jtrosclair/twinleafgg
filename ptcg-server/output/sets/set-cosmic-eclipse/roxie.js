"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roxie = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Roxie extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '205';
        this.name = 'Roxie';
        this.fullName = 'Roxie CEC';
        this.text = 'Discard up to 2 Pokémon that aren\'t Pokémon-GX or Pokémon-EX from your hand. Draw 3 cards for each card you discarded in this way.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && !(card.tags.includes(card_types_1.CardTag.POKEMON_EX) || card.tags.includes(card_types_1.CardTag.POKEMON_GX))) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 0, max: 2, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const cardsToDraw = 3 * cards.length;
                state = (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards, sourceCard: this });
                (0, prefabs_1.DRAW_CARDS)(player, cardsToDraw);
                // Handling Blow-Away Bomb mons (Joe forgive me for this, I'm going rogue and putting the effect in here)
                // I could not for the life of me figure out how to get the effect to be contained in Koffing and Weezing themselves itself
                cards.forEach(card => {
                    if (card instanceof game_1.PokemonCard && (card.fullName === 'Koffing CEC' || card.fullName === 'Weezing CEC')) {
                        const pokemonCard = card;
                        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, pokemonCard)) {
                            return state;
                        }
                        (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, effect.player, result => {
                            if (result) {
                                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                                    const effectOfAbility = new game_effects_1.EffectOfAbilityEffect(effect.player, pokemonCard.powers[0], pokemonCard, cardList);
                                    effectOfAbility.target = cardList;
                                    store.reduceEffect(state, effectOfAbility);
                                    if (effectOfAbility.target) {
                                        cardList.damage += 10;
                                    }
                                });
                            }
                        });
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.Roxie = Roxie;
