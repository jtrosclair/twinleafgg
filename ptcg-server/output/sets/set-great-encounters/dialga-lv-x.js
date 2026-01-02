"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialgaLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DialgaLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Dialga';
        this.cardType = M;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X];
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Dialga. Dialga LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'Time Skip',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may have your opponent flip 2 coins. If both of them are heads, your turn ends. If both of them are tails, after your opponent draws a card at the beginning of his or her next turn, his or her turn ends. This power can\'t be used if Dialga is affected by a Special Condition.'
            }
        ];
        this.attacks = [{
                name: 'Metal Flash',
                cost: [M, M, C, C],
                damage: 80,
                text: 'During your next turn, Dialga can\'t use Metal Flash.'
            }];
        this.set = 'GE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Dialga';
        this.fullName = 'Dialga LV.X GE';
        this.TIME_SKIP_EFFECT_MARKER = 'TIME_SKIP_EFFECT_MARKER';
        this.TIME_SKIP_USED_MARKER = 'TIME_SKIP_USED_MARKER';
        this.METAL_FLASH_USED_MARKER = 'METAL_FLASH_USED_MARKER';
        this.METAL_FLASH_USED_2_MARKER = 'METAL_FLASH_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TIME_SKIP_USED_MARKER, this);
        // Time Skip
        if (effect instanceof game_phase_effects_1.BeginTurnEffect && prefabs_1.HAS_MARKER(this.TIME_SKIP_EFFECT_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.TIME_SKIP_EFFECT_MARKER, effect.player, this);
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(effect.player);
            return store.reduceEffect(state, endTurnEffect);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            if (prefabs_1.HAS_MARKER(this.TIME_SKIP_USED_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, opponent, 2, results => {
                if (results.every(result => result === true)) {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    return store.reduceEffect(state, endTurnEffect);
                }
                if (results.every(result => result === false)) {
                    prefabs_1.ADD_MARKER(this.TIME_SKIP_EFFECT_MARKER, opponent, this);
                }
            });
            prefabs_1.ADD_MARKER(this.TIME_SKIP_USED_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.METAL_FLASH_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.METAL_FLASH_USED_MARKER, this.METAL_FLASH_USED_2_MARKER, this);
        // Metal Flash
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.METAL_FLASH_USED_2_MARKER, effect.player, this);
            prefabs_1.ADD_MARKER(this.METAL_FLASH_USED_MARKER, effect.player, this);
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
exports.DialgaLVX = DialgaLVX;
