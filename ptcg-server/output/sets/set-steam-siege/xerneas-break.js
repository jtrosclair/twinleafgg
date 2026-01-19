"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XerneasBREAK = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class XerneasBREAK extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BREAK;
        this.tags = [card_types_1.CardTag.BREAK];
        this.evolvesFrom = 'Xerneas';
        this.cardType = Y;
        this.hp = 150;
        this.powers = [{
                name: 'BREAK Evolution Rule',
                powerType: game_1.PowerType.BREAK_RULE,
                text: 'Xerneas BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
            }];
        this.attacks = [{
                name: 'Life Stream',
                cost: [Y, Y],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage times the amount of Energy attached to all of your Pokémon.'
            }];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Xerneas BREAK';
        this.fullName = 'Xerneas BREAK STS';
    }
    reduceEffect(store, state, effect) {
        // Life Stream
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const energyOnPokemon = card.cards.filter(c => c instanceof game_1.EnergyCard);
                energies += energyOnPokemon.length;
            });
            effect.damage = energies * 20;
        }
        // slapping on the weakness, resistance, and retreat of the previous evolutions
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const cardList = effect.target;
            const previousPokemon = cardList.getPokemonCard();
            if (previousPokemon) {
                this.weakness = [...previousPokemon.weakness];
                this.resistance = [...previousPokemon.resistance];
                this.retreat = [...previousPokemon.retreat];
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
exports.XerneasBREAK = XerneasBREAK;
