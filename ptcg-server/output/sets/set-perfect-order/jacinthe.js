"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jacinthe = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Jacinthe extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Jacinthe';
        this.fullName = 'Jacinthe M3';
        this.text = 'Heal 150 damage from 1 of your [P] Pokemon.';
    }
    canPlay(store, state, player) {
        if (player.supporterTurn > 0) {
            return false;
        }
        // Check if any Psychic Pokemon have damage
        let hasDamagedPsychicPokemon = false;
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
            const pokemonCard = cardList.getPokemonCard();
            if (pokemonCard && pokemonCard.cardType === game_1.CardType.PSYCHIC && cardList.damage > 0) {
                hasDamagedPsychicPokemon = true;
            }
        });
        if (!hasDamagedPsychicPokemon) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Find Psychic Pokemon
            const psychicPokemon = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard) {
                    const checkType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                    store.reduceEffect(state, checkType);
                    if (checkType.cardTypes.includes(game_1.CardType.PSYCHIC)) {
                        psychicPokemon.push(cardList);
                    }
                }
            });
            if (psychicPokemon.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if any Psychic Pokemon have damage
            let hasDamagedPsychicPokemon = false;
            for (const cardList of psychicPokemon) {
                if (cardList.damage > 0) {
                    hasDamagedPsychicPokemon = true;
                    break;
                }
            }
            if (!hasDamagedPsychicPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const target = targets[0];
                    // Verify it's a Psychic Pokemon
                    const checkType = new check_effects_1.CheckPokemonTypeEffect(target);
                    store.reduceEffect(state, checkType);
                    if (checkType.cardTypes.includes(game_1.CardType.PSYCHIC)) {
                        const healEffect = new game_effects_1.HealEffect(player, target, 150);
                        store.reduceEffect(state, healEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Jacinthe = Jacinthe;
