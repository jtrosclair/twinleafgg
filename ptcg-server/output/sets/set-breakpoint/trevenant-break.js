"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrevenantBREAK = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class TrevenantBREAK extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BREAK;
        this.tags = [card_types_1.CardTag.BREAK];
        this.evolvesFrom = 'Trevenant';
        this.cardType = P;
        this.hp = 160;
        this.powers = [{
                name: 'BREAK Evolution Rule',
                powerType: game_1.PowerType.BREAK_RULE,
                text: 'Trevenant BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
            }];
        this.attacks = [{
                name: 'Silent Fear',
                cost: [P, C],
                damage: 0,
                text: 'Put 3 damage counters on each of your opponent\'s Pokémon.'
            }];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Trevenant BREAK';
        this.fullName = 'Trevenant BREAK BKP';
    }
    reduceEffect(store, state, effect) {
        // Silent Fear
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                const damage = new attack_effects_1.PutCountersEffect(effect, 30);
                damage.target = card;
                store.reduceEffect(state, damage);
            });
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
exports.TrevenantBREAK = TrevenantBREAK;
