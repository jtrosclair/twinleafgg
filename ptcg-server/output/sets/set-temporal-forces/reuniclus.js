"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reuniclus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reuniclus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Duosion';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Summoning Gate',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Look at the top 8 cards of your deck and put any number of Pokémon you find there onto your Bench. Shuffle the other cards into your deck.'
            },
            {
                name: 'Brain Shake',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Reuniclus';
        this.fullName = 'Reuniclus TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Count Pokemon in top 8 cards and track non-Pokemon positions
            const blocked = [];
            let pokemonCount = 0;
            player.deck.cards.forEach((c, index) => {
                if (c instanceof pokemon_card_1.PokemonCard) {
                    pokemonCount += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            const maxPokemons = Math.min(pokemonCount, openSlots.length);
            const deckTop = new game_1.CardList();
            (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, deckTop, { count: 8 });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, deckTop, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: openSlots.length, allowCancel: false, blocked, maxPokemons }), selectedCards => {
                const cards = selectedCards || [];
                // Move selected cards to open bench slots
                cards.forEach((card, index) => {
                    const targetSlot = openSlots[index];
                    (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, targetSlot, { cards: [card] });
                    targetSlot.pokemonPlayedTurn = state.turn;
                });
                // Move remaining cards back to deck
                (0, prefabs_1.MOVE_CARDS)(store, state, deckTop, player.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Reuniclus = Reuniclus;
