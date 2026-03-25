"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azurill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Azurill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Baby Evolution',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may put Marill from your hand onto Azurill (this counts as evolving Azurill), and remove all damage counters from Azurill.'
            }];
        this.attacks = [{
                name: 'Jump Catch',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'SS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Azurill';
        this.fullName = 'Azurill SS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasElectabuzz = player.hand.cards.some(card => card instanceof pokemon_card_1.PokemonCard && card.name === 'Electabuzz');
            // Check if Electabuzz is in the player's hand
            if (!hasElectabuzz) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Blocking pokemon cards, that cannot be valid evolutions
            const blocked = [];
            player.hand.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name !== 'Electabuzz') {
                    blocked.push(index);
                }
            });
            let selectedCards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
                selectedCards = selected || [];
                const evolution = selectedCards[0];
                const target = game_1.StateUtils.findCardList(state, this);
                // Evolve Pokemon
                player.hand.moveCardTo(evolution, target);
                const pokemonTarget = target;
                pokemonTarget.clearEffects();
                pokemonTarget.pokemonPlayedTurn = state.turn;
                // Heal all damage from the evolved Pokemon
                const healEffect = new game_effects_1.HealEffect(player, pokemonTarget, pokemonTarget.damage);
                store.reduceEffect(state, healEffect);
                return state;
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 1, max: 1 });
        }
        return state;
    }
}
exports.Azurill = Azurill;
