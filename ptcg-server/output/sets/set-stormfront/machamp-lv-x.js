"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachampLVX = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MachampLVX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LV_X;
        this.evolvesFrom = 'Machamp';
        this.cardType = F;
        this.tags = [card_types_1.CardTag.POKEMON_LV_X];
        this.hp = 150;
        this.weakness = [{ type: P, value: 40 }];
        this.retreat = [C, C, C];
        this.powers = [
            {
                name: 'LV.X Rule',
                powerType: game_1.PowerType.LV_X_RULE,
                text: 'Put this card onto your Active Dialga G. Dialga G LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
            },
            {
                name: 'No Guard',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Machamp is your Active Pokémon, each of Machamp\'s attacks does 60 more damage to the Active Pokémon (before applying Weakness and Resistance) and any damage done to Machamp by your opponent\'s Pokémon is increased by 60 (after applying Weakness and Resistance).'
            }
        ];
        this.attacks = [{
                name: 'Strong-Willed',
                cost: [F, C, C],
                damage: 20,
                text: 'During your opponent\'s next turn, if Machamp would be Knocked Out by damage from an attack, flip a coin. If heads, Machamp is not Knocked Out and its remaining HP becomes 10 instead.'
            }];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Machamp';
        this.fullName = 'Machamp LV.X SF';
        this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // No Guard: dealing damage
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active.getPokemonCard();
            const damageSource = effect.source.getPokemonCard();
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            // checking if it's your attack
            if (damageSource && damageSource === oppActive) {
                return state;
            }
            // checking if the damage is caused by this garchomp
            if (damageSource && damageSource !== this) {
                return state;
            }
            effect.damage += 60;
        }
        // No Guard: taking damage
        if ((effect instanceof attack_effects_1.DealDamageEffect || effect instanceof attack_effects_1.PutDamageEffect) && effect.target.getPokemonCard() === this) {
            const opponent = effect.player;
            const player = game_1.StateUtils.getOpponent(state, opponent);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const activePokemonCard = player.active.getPokemonCard();
            if (activePokemonCard && activePokemonCard !== this) {
                return state;
            }
            effect.damage += 60;
        }
        // Strong-Willed
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result)
                    return;
                (0, prefabs_1.ADD_MARKER)(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.player.active, this);
                (0, prefabs_1.ADD_MARKER)(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
            });
            return state;
        }
        //Strong-Willed in effect
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.cards.includes(this)
            && (0, prefabs_1.HAS_MARKER)(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.target, this)) {
            effect.surviveOnTenHPReason = this.attacks[0].name;
            return state;
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            //Remove the marker at the end of the opponent's turn.
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                (0, prefabs_1.REMOVE_MARKER)(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, cardList, this);
            });
        }
        //Lv. X Stuff
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
exports.MachampLVX = MachampLVX;
