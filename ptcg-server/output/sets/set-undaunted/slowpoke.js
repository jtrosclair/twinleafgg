"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rambunctious Party',
                cost: [C],
                damage: 0,
                text: 'Look at the top 5 cards of your deck. Choose as many Basic Pokémon as you like and put them onto your Bench. Shuffle the other cards back into your deck.'
            },
            {
                name: 'Rain Splash',
                cost: [W, C],
                damage: 20,
                text: ''
            }];
        this.set = 'UD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke UD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                return state;
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            // Set maxPokemons to number of open slots
            const maxPokemons = Math.min(openSlots.length, deckTop.cards.filter(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC).length);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckTop, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxPokemons, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    deckTop.moveCardTo(card, openSlots[index]);
                    openSlots[index].pokemonPlayedTurn = state.turn;
                });
                deckTop.moveTo(player.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
