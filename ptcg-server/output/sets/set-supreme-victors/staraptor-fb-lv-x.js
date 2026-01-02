"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaraptorFBLVX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StaraptorFBLVX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staraptor FB';
        this.tags = [game_1.CardTag.POKEMON_SP];
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Fast Call',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Staraptor FB is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Defog',
                cost: [C, C, C],
                damage: 40,
                text: 'Before doing damage, you may discard any Stadium card in play. If you do, this attack\'s base damage is 70 instead of 40.'
            }];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.name = 'Staraptor FB Lv. X';
        this.fullName = 'Staraptor FB Lv. X SV';
        this.FAST_CALL_MARKER = 'FAST_CALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.FAST_CALL_MARKER, player, this);
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { min: 0, max: 1 }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                cards.forEach(card => prefabs_1.MOVE_CARD_TO(state, card, player.hand));
                prefabs_1.ADD_MARKER(this.FAST_CALL_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.FAST_CALL_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (game_1.StateUtils.getStadiumCard(state) === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    attack_effects_1.DISCARD_A_STADIUM_CARD_IN_PLAY(state);
                    effect.damage = 70;
                }
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
                if (evolutionCard.superType === game_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
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
                if (evolutionCard.superType === game_1.SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
                    effect.powers.push(...(evolutionCard.powers || []));
                }
            }
        }
        return state;
    }
}
exports.StaraptorFBLVX = StaraptorFBLVX;
