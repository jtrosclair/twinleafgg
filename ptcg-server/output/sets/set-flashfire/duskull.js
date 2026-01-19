"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Revival',
                cost: [C],
                damage: 0,
                text: 'Put a Basic Pokémon from your opponent\'s discard pile onto his or her Bench.'
            },
            {
                name: 'Sneaky Placement',
                cost: [P],
                damage: 0,
                text: 'Put 1 damage counter on your opponent\'s Active Pokémon.'
            }];
        this.set = 'FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Duskull';
        this.fullName = 'Duskull FLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if opponent's bench is full
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                return state;
            }
            if (!opponent.discard.cards.some(c => c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.BASIC)) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH, opponent.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const card = cards[0];
                    const slot = openSlots[0];
                    opponent.discard.moveCardTo(card, slot);
                    slot.pokemonPlayedTurn = state.turn;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)(1, store, state, effect);
        }
        return state;
    }
}
exports.Duskull = Duskull;
