"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntheaAndConcordia = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
class AntheaAndConcordia extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '182';
        this.name = 'Anthea & Concordia';
        this.fullName = 'Anthea & Concordia M2a';
        this.extraPrizes = false;
        this.text = `You can use this card only if you have N's Darmanitan, N's Zoroark ex, N's Vanilluxe, N's Klinklang, N's Reshiram, and N's Zekrom in play.

During this turn, if your opponent's Active Pokémon is Knocked Out by damage from an attack used by your N's Pokémon, take 3 more Prize cards.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Check if all 6 required N's Pokémon are in play
            const requiredPokemon = [
                'N\'s Darmanitan',
                'N\'s Zoroark ex',
                'N\'s Vanilluxe',
                'N\'s Klinklang',
                'N\'s Reshiram',
                'N\'s Zekrom'
            ];
            const foundPokemon = new Set();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
                if (requiredPokemon.includes(pokemonCard.name)) {
                    foundPokemon.add(pokemonCard.name);
                }
            });
            // Check if all required Pokémon are found
            if (foundPokemon.size !== requiredPokemon.length) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            this.extraPrizes = true;
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            // effect.player is the owner of the knocked out Pokémon (the opponent)
            const knockedOutPlayer = effect.player;
            const attacker = game_1.StateUtils.getOpponent(state, knockedOutPlayer);
            // Check if this card is in the attacker's supporter pile and was played this turn
            if (!attacker.supporter.cards.includes(this) || !this.extraPrizes) {
                return state;
            }
            // Do not activate between turns, or when it's not attacker's turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
                return state;
            }
            // Check if the knocked out Pokémon belongs to the opponent
            if (effect.target === knockedOutPlayer.active) {
                const attackingPokemon = attacker.active.getPokemonCard();
                // Check if attacking Pokémon is an N's Pokémon
                if (attackingPokemon) {
                    const isNsPokemon = attackingPokemon.name.startsWith('N\'s') ||
                        attackingPokemon.tags.includes(card_types_1.CardTag.NS);
                    if (isNsPokemon && effect.prizeCount > 0) {
                        effect.prizeCount += 3;
                    }
                }
                this.extraPrizes = false;
                attacker.supporter.moveCardTo(this, attacker.discard);
            }
            return state;
        }
        return state;
    }
}
exports.AntheaAndConcordia = AntheaAndConcordia;
