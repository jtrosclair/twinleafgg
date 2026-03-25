"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mantine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mantine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Borne Ashore',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put a Basic Pokémon from either player\'s discard pile onto that player\'s Bench.'
            },
            {
                name: 'Aqua Edge',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Mantine';
        this.fullName = 'Mantine ASR';
    }
    reduceEffect(store, state, effect) {
        // Borne Ashore: Put a Basic Pokemon from either player's discard pile onto that player's Bench.
        // Ref: set-guardians-rising/alomomola.ts (same attack text, same pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerHasBasics = player.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC);
            const opponentHasBasics = opponent.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC);
            if (!playerHasBasics && !opponentHasBasics) {
                return state;
            }
            const playerHasSpace = player.bench.some(b => b.cards.length === 0);
            const opponentHasSpace = opponent.bench.some(b => b.cards.length === 0);
            // Offer player's discard first (with cancel if opponent's discard is also an option)
            if (playerHasBasics && playerHasSpace) {
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: opponentHasBasics && opponentHasSpace }), selected => {
                    cards = selected || [];
                    if (cards.length > 0) {
                        const slot = player.bench.find(b => b.cards.length === 0);
                        if (slot) {
                            player.discard.moveCardTo(cards[0], slot);
                            slot.pokemonPlayedTurn = state.turn;
                        }
                    }
                    else if (opponentHasBasics && opponentHasSpace) {
                        // Player chose to use opponent's discard instead
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected2 => {
                            const cards2 = selected2 || [];
                            if (cards2.length > 0) {
                                const slot = opponent.bench.find(b => b.cards.length === 0);
                                if (slot) {
                                    opponent.discard.moveCardTo(cards2[0], slot);
                                    slot.pokemonPlayedTurn = state.turn;
                                }
                            }
                        });
                    }
                });
            }
            // Only opponent's discard has basics with available bench space
            if (opponentHasBasics && opponentHasSpace) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        const slot = opponent.bench.find(b => b.cards.length === 0);
                        if (slot) {
                            opponent.discard.moveCardTo(cards[0], slot);
                            slot.pokemonPlayedTurn = state.turn;
                        }
                    }
                });
            }
        }
        return state;
    }
}
exports.Mantine = Mantine;
