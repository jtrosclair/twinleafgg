"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fletchling = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fletchling extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Chirp',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Pokemon with [F] Resistances, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Peck',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Fletchling';
        this.fullName = 'Fletchling M3';
    }
    reduceEffect(store, state, effect) {
        // Chirp - search for Pokemon with Fire resistance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Filter deck for Pokemon with Fire resistance
            const pokemonWithFightingResistance = player.deck.cards.filter(card => card instanceof pokemon_card_1.PokemonCard &&
                card.resistance &&
                card.resistance.some(res => res.type === game_1.CardType.FIRE));
            if (pokemonWithFightingResistance.length === 0) {
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            const maxToTake = Math.min(2, pokemonWithFightingResistance.length);
            // Block cards that don't have Fire resistance
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof pokemon_card_1.PokemonCard) ||
                    !card.resistance ||
                    !card.resistance.some(res => res.type === game_1.CardType.FIGHTING)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: maxToTake, allowCancel: false, blocked }), selected => {
                const selectedCards = selected || [];
                player.deck.moveCardsTo(selectedCards, player.hand);
                // Show cards to opponent
                if (selectedCards.length > 0) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selectedCards), () => state);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Fletchling = Fletchling;
