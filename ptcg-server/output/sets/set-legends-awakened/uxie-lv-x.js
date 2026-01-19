"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UxieLVX = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class UxieLVX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.LV_X;
        this.evolvesFrom = 'Uxie';
        this.tags = [game_1.CardTag.POKEMON_LV_X];
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Trade Off',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may look at the top 2 cards of your deck, choose 1 of them, and put it into your hand. Put the other card on the bottom of your deck. This power can\'t be used if Uxie is affected by a Special Condition. You can\'t use more than 1 Trade Off Poké-Power each turn.'
            }];
        this.attacks = [{
                name: 'Zen Blade',
                cost: [C, C],
                damage: 60,
                text: 'Uxie can\'t use Zen Blade during your next turn.'
            }];
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.name = 'Uxie';
        this.fullName = 'Uxie Lv. X LA';
        this.TRADE_OFF_MARKER = 'TRADE_OFF_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.TRADE_OFF_MARKER, player, this);
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            const deckBottom = new game_1.CardList();
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 2);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                (0, prefabs_1.ADD_MARKER)(this.TRADE_OFF_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(deckBottom);
                deckBottom.moveTo(player.deck);
                return state;
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.TRADE_OFF_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_2_MARKER, this);
        (0, prefabs_1.REPLACE_MARKER_AT_END_OF_TURN)(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_EFFECT_IF_MARKER)(this.ATTACK_USED_2_MARKER, effect.player, this);
            (0, prefabs_1.ADD_MARKER)(this.ATTACK_USED_MARKER, effect.player, this);
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
exports.UxieLVX = UxieLVX;
