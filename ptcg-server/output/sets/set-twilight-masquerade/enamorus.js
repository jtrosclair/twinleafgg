"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enamorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Enamorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Heart Sign',
                cost: [C],
                damage: 30,
                text: ''
            },
            {
                name: 'Love Resonance',
                cost: [P, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If any of your Pokémon in play are the same type as any of your opponent\'s Pokémon in play, this attack does 120 more damage.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Enamorus';
        this.fullName = 'Enamorus TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if any of your Pokémon in play are the same type as any of your opponent's Pokémon in play
            let hasMatchingTypes = false;
            const playerTypes = new Set();
            const opponentTypes = new Set();
            // Collect types from player's Pokémon in play
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.cards.length > 0) {
                    const pokemonCard = cardList.cards[0];
                    playerTypes.add(pokemonCard.cardType);
                    if (pokemonCard.additionalCardTypes) {
                        pokemonCard.additionalCardTypes.forEach(type => playerTypes.add(type));
                    }
                }
            });
            // Collect types from opponent's Pokémon in play
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.cards.length > 0) {
                    const pokemonCard = cardList.cards[0];
                    opponentTypes.add(pokemonCard.cardType);
                    if (pokemonCard.additionalCardTypes) {
                        pokemonCard.additionalCardTypes.forEach(type => opponentTypes.add(type));
                    }
                }
            });
            // Check for matching types
            for (const playerType of playerTypes) {
                if (opponentTypes.has(playerType)) {
                    hasMatchingTypes = true;
                    break;
                }
            }
            // Apply bonus damage if types match
            if (hasMatchingTypes) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.Enamorus = Enamorus;
