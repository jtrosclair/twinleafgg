"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latias = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Latias extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Dual Aura',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as you have Latios or Latios ex in play, each player\'s Evolved Pokémon (excluding Pokémon-ex) can\'t use any Poké-Bodies.'
            }];
        this.attacks = [{
                name: 'Spearhead',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Dragon Claw',
                cost: [R, C, C],
                damage: 40,
                text: ''
            }];
        this.set = 'HP';
        this.name = 'Latias';
        this.fullName = 'Latias HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        // Block Poké-Bodies from evos
        if (effect instanceof game_effects_1.PowerEffect) {
            const pokemonCard = effect.card;
            const cardList = game_1.StateUtils.findCardList(state, pokemonCard);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            let isLatiosInPlayPlayer = false;
            let isThisInPlayPlayer = false;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Latios' || card.name === 'Latios ex') {
                    isLatiosInPlayPlayer = true;
                }
                if (card === this) {
                    isThisInPlayPlayer = true;
                }
            });
            let isLatiosInPlayOpponent = false;
            let isThisInPlayOpponent = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.name === 'Latios' || card.name === 'Latios ex') {
                    isLatiosInPlayOpponent = true;
                }
                if (card === this) {
                    isThisInPlayOpponent = true;
                }
            });
            // ^ there is probably a better way to do this, but I don't know it. Feel free to change it
            if ((!isLatiosInPlayPlayer || !isThisInPlayPlayer) &&
                (!isLatiosInPlayOpponent || !isThisInPlayOpponent)) {
                return state;
            }
            const isEvolved = cardList instanceof game_1.PokemonCardList && cardList.getPokemons().length > 1;
            const isPokemonEx = cardList instanceof game_1.PokemonCardList && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex);
            if (!effect.power.exemptFromAbilityLock) {
                if (isEvolved && !isPokemonEx && effect.power.powerType === pokemon_types_1.PowerType.POKEBODY) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        // Spearhead
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.DRAW_CARDS)(effect.player, 1);
        }
        return state;
    }
}
exports.Latias = Latias;
