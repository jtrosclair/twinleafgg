"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarchompCLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class GarchompCLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Garchomp C';
        this.cardType = C;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X, card_types_1.CardTag.POKEMON_SP];
        this.hp = 110;
        this.weakness = [{ type: C }];
        this.retreat = [];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Garchomp C. Garchomp C LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Healing Breath',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), when you put Garchomp C LV.X from your hand onto your Active Garchomp C, you may remove all damage counters from each of your Pokémon SP.'
            }
        ];
        this.attacks = [{
                name: 'Dragon Rush',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard 2 Energy attached to Garchomp C. Choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Garchomp C can\'t use Dragon Rush during your next turn.'
            }];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Garchomp C';
        this.fullName = 'Garchomp C LV.X SV';
        this.DRAGON_RUSH_MARKER = 'DRAGON_RUSH_MARKER';
        this.DRAGON_RUSH_MARKER_2 = 'DRAGON_RUSH_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // Healing Breath
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                        var _a;
                        if ((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_SP)) {
                            const healing = new game_effects_1.HealEffect(player, card, card.damage);
                            store.reduceEffect(state, healing);
                        }
                    });
                }
            });
        }
        // Dragon Rush
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.marker.hasMarker(this.DRAGON_RUSH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
            effect.player.marker.addMarker(this.DRAGON_RUSH_MARKER, this);
        }
        // removing the markers for preventing the pokemon from attacking
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGON_RUSH_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.DRAGON_RUSH_MARKER, this);
            effect.player.marker.removeMarker(this.DRAGON_RUSH_MARKER_2, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGON_RUSH_MARKER, this)) {
            effect.player.marker.addMarker(this.DRAGON_RUSH_MARKER_2, this);
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
exports.GarchompCLVX = GarchompCLVX;
