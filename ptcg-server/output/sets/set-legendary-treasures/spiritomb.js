"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.retreat = [C];
        this.powers = [{
                name: 'Sealing Scream',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each player can\'t play any ACE SPEC cards from his or her hand.'
            }];
        this.attacks = [{
                name: 'Hexed Mirror',
                cost: [C],
                damage: 0,
                text: 'Shuffle your hand into your deck. Then, draw a number of cards equal to the number of cards in your opponent\'s hand.'
            }];
        this.set = 'LTR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb LTR';
        this.OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER = 'OPPONENT_CANNOT_PLAY_ACE_SPECS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpiritombInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            if (!isSpiritombInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpiritombInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            if (!isSpiritombInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpiritombInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            if (!isSpiritombInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.trainerCard.tags.includes(card_types_1.CardTag.ACE_SPEC)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpiritombInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpiritombInPlay = true;
                }
            });
            if (!isSpiritombInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            prefabs_1.MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this) });
            prefabs_1.SHUFFLE_DECK(store, state, player);
            prefabs_1.DRAW_CARDS(player, effect.opponent.hand.cards.length);
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
