"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [{
                name: 'Luna Shade',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as you have Solrock in play, each player\'s [R] Pokémon (excluding Pokémon-ex) can\'t use any Poké-Powers.'
            }];
        this.attacks = [
            {
                name: 'Moon Guidance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Trainer card (excluding Supporter cards), show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Psyshock',
                cost: [P],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'LM';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
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
            let isSolrockInPlay = false;
            let isThisInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Solrock') {
                    isSolrockInPlay = true;
                }
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isSolrockInPlay || !isThisInPlay) {
                return state;
            }
            let cardTypes = [effect.card.cardType];
            const cardList = game_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof game_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
                cardTypes = checkPokemonType.cardTypes;
            }
            // We are blocking the powers from fire Pokemon
            if (!cardTypes.includes(card_types_1.CardType.FIRE)) {
                return state;
            }
            if (!effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        // Moon Guidance
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            // TODO: make this format dependent (only items in modern or unlimited fomrats)
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER) {
                    blocked.push(index);
                }
            });
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                if (selected.length === 0) {
                    return state;
                }
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, effect.opponent, cards);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected, sourceCard: this, sourceEffect: this.attacks[0] });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
