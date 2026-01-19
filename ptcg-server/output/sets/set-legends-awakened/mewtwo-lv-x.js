"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoLVX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MewtwoLVX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.LV_X;
        this.evolvesFrom = 'Mewtwo';
        this.tags = [game_1.CardTag.POKEMON_LV_X];
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Psybarrier',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Prevent all effects of attacks, including damage, done to Mewtwo by your opponent\'s Pokémon that isn\'t an Evolved Pokémon.'
            }];
        this.attacks = [{
                name: 'Giga Burn',
                cost: [P, P, C],
                damage: 120,
                text: 'Discard all Energy attached to Mewtwo.'
            }];
        this.set = 'LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Mewtwo';
        this.fullName = 'Mewtwo Lv. X LA';
    }
    reduceEffect(store, state, effect) {
        // Prevent effects of attacks, including damage
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.getPokemonCard() === this) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (!(effect.source.getPokemons().length > 1 && !(sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(game_1.CardTag.LEGEND)) && !(sourceCard === null || sourceCard === void 0 ? void 0 : sourceCard.tags.includes(game_1.CardTag.POKEMON_VUNION)))) {
                const player = game_1.StateUtils.findOwner(state, effect.target);
                if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
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
exports.MewtwoLVX = MewtwoLVX;
