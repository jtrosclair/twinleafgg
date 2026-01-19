"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solrock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Solrock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Luna Shade',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as you have Lunatone in play, each player\'s [C] Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
            }];
        this.attacks = [
            {
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Lunatone and put it onto your Bench. Shuffle your deck afterward.'
            },
            {
                name: 'Hyper Beam',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
            }
        ];
        this.set = 'LM';
        this.name = 'Solrock';
        this.fullName = 'Solrock LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
    }
    reduceEffect(store, state, effect) {
        // Block Poké-Powers from basics when active
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER) {
            const player = effect.player;
            const thisCardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, thisCardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            let isLunatoneInPlay = false;
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Lunatone') {
                    isLunatoneInPlay = true;
                }
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isLunatoneInPlay || !isThisInPlay) {
                return state;
            }
            let cardTypes = [effect.card.cardType];
            const cardList = game_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof game_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
                cardTypes = checkPokemonType.cardTypes;
            }
            // We are blocking the powers from colorless Pokemon
            if (!cardTypes.includes(card_types_1.CardType.COLORLESS)) {
                return state;
            }
            if (!effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Call for Family
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name === 'Lunatone') {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, {}, { min: 0, max: 1, blocked });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        const card = selected[0];
                        (0, prefabs_1.MOVE_CARDS)(store, state, opponent.active, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: this.attacks[1] });
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Solrock = Solrock;
