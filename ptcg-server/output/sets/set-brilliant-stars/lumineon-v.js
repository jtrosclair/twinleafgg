"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LumineonV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LumineonV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Luminous Sign',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand onto your ' +
                    'Bench during your turn, you may search your deck for a ' +
                    'Supporter card, reveal it, and put it into your hand. Then, ' +
                    'shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Aqua Return',
                cost: [W, C, C],
                damage: 120,
                text: 'Shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Lumineon V';
        this.fullName = 'Lumineon V BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && (card.trainerType !== card_types_1.TrainerType.SUPPORTER)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
                }
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const pokemons = player.active.getPokemons();
            const otherCards = player.active.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                !pokemons.includes(card) &&
                (!player.active.tools || !player.active.tools.includes(card)));
            const tools = [...player.active.tools];
            player.active.clearEffects();
            // Move other cards to deck
            if (otherCards.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.deck, { cards: otherCards });
            }
            // Move tools to deck explicitly
            for (const tool of tools) {
                player.active.moveCardTo(tool, player.deck);
            }
            // Move Pokémon to deck
            if (pokemons.length > 0) {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.deck, { cards: pokemons });
            }
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.LumineonV = LumineonV;
