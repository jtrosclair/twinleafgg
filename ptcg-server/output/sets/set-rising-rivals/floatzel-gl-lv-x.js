"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatzelGLLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FloatzelGLLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Floatzel GL';
        this.cardType = W;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X, card_types_1.CardTag.POKEMON_SP];
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Floatzel GL. Floatzel GL LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Water Rescue',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever any of your [W] Pokémon (excluding any Floatzel GL) is Knocked Out by damage from your opponent\'s attack, you may put that Pokémon and all cards that were attached to it from your discard pile into your hand.'
            }
        ];
        this.attacks = [{
                name: 'Energy Cyclone',
                cost: [W, W],
                damage: 20,
                damageCalculation: 'x',
                text: 'Choose as many Energy cards from your hand as you like and show them to your opponent. This attack does 20 damage times the number of Energy cards you chose. Put those Energy cards on top of your deck. Shuffle your deck afterward.'
            }];
        this.set = 'RR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Floatzel GL';
        this.fullName = 'Floatzel GL LV.X RR';
        this.WATER_RESCUE_MARKER = 'WATER_RESCUE_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        // Water Rescue
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) !== card_types_1.CardType.WATER) {
                return state;
            }
            if (((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) === 'Floatzel GL') {
                return state;
            }
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card.getPokemonCard() === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            const target = effect.target;
            const cards = target.cards;
            cards.forEach(card => {
                player.marker.addMarker(this.WATER_RESCUE_MARKER, card);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.marker.hasMarker(this.WATER_RESCUE_MARKER)) {
            state.players.forEach(player => {
                if (!player.marker.hasMarker(this.WATER_RESCUE_MARKER)) {
                    return;
                }
                const rescued = player.marker.markers
                    .filter(m => m.name === this.WATER_RESCUE_MARKER && m.source !== undefined)
                    .map(m => m.source);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: rescued });
                player.marker.removeMarker(this.WATER_RESCUE_MARKER);
            });
        }
        // Energy Cyclone
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energiesInHand = player.hand.cards.filter(card => card instanceof game_1.EnergyCard && card.superType === card_types_1.SuperType.ENERGY);
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: energiesInHand.length }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, effect.opponent, cards);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: cards });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                effect.damage = (cards.length * 20);
                return state;
            });
        }
        // making sure it gets put on the active pokemon
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            if (effect.target !== effect.player.active) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        // Trying to get all of the previous stage's attacks and powers
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                    player.showAllStageAbilities = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Add attacks from the previous stage to this one
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.attacks.push(...(evolutionCard.attacks || []));
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // Adds the powers from the previous stage
            for (const evolutionCard of cardList.cards) {
                if (evolutionCard.superType === card_types_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.FloatzelGLLVX = FloatzelGLLVX;
