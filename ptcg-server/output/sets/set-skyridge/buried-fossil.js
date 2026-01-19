"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuriedFossil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BuriedFossil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 30;
        this.retreat = [C];
        this.powers = [
            {
                name: 'Evolution',
                powerType: game_1.PowerType.TRAINER_ABILITY,
                useWhenInPlay: true,
                text: 'You may play a Pokémon card that evolves from Mysterious Fossil on top of Buried Fossil. (This counts as evolving Buried Fossil.) Buried Fossil can\'t be affected by Special Conditions.'
            },
            {
                name: 'Reconstruction',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if you have a basic Energy card in your hand, you may search your deck for an Omanyte or Kabuto card, show it to your opponent, and put it into your hand. Then put a basic Energy card from your hand into your deck. Shuffle your deck afterward.'
            }
        ];
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Buried Fossil';
        this.fullName = 'Buried Fossil SK';
    }
    reduceEffect(store, state, effect) {
        // Cannot be affected by Special Conditions
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                const activeCard = player.active.getPokemonCard();
                if (player.active.specialConditions.length === 0 || (activeCard && activeCard.name !== 'Buried Fossil')) {
                    return state;
                }
                const conditions = player.active.specialConditions.slice();
                conditions.forEach(condition => {
                    player.active.removeSpecialCondition(condition);
                });
            });
            return state;
        }
        // Evolution ruling power thing
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEvolution = player.hand.cards.some(card => card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom === 'Mysterious Fossil');
            // Check if evo is in the player's hand
            if (!hasEvolution) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (state.turn === this.cards.pokemonPlayedTurn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Blocking pokemon cards, that cannot be valid evolutions
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== 'Mysterious Fossil') {
                    blocked.push(index);
                }
            });
            let selectedCards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
                selectedCards = selected || [];
                const evolution = selectedCards[0];
                const target = game_1.StateUtils.findCardList(state, this);
                // Evolve Pokemon
                player.hand.moveCardTo(evolution, target);
                const pokemonTarget = target;
                pokemonTarget.clearEffects();
                pokemonTarget.pokemonPlayedTurn = state.turn;
                return state;
            });
        }
        // Reconstruction
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 1, this)) {
            const player = effect.player;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), selected => {
                if (selected) {
                    selected.forEach(card => {
                        player.hand.moveCardTo(card, player.deck);
                    });
                }
                const blocked = [];
                player.deck.cards.forEach((card, index) => {
                    if (card instanceof pokemon_card_1.PokemonCard && (card.name !== 'Omanyte' && card.name !== 'Kabuto')) {
                        blocked.push(index);
                    }
                });
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
                    if (selectedCards && selectedCards.length > 0) {
                        const selectedCard = selectedCards[0];
                        player.deck.moveCardTo(selectedCard, player.hand);
                    }
                    store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
            return state;
        }
        return state;
    }
}
exports.BuriedFossil = BuriedFossil;
