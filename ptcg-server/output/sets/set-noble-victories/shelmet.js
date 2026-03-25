"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shelmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Mysterious Evolution',
                cost: [C],
                damage: 0,
                text: 'If Karrablast is in play, search your deck for a card that evolves from this Pokémon and put it onto this Pokémon. (This counts as evolving this Pokémon.) Shuffle your deck afterward.'
            },
            {
                name: 'Ram',
                cost: [G],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Shelmet';
        this.fullName = 'Shelmet NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if Karrablast is in play (anywhere for either player)
            let karrablastInPlay = false;
            state.players.forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    var _a;
                    if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Karrablast') {
                        karrablastInPlay = true;
                    }
                });
                p.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                    var _a;
                    if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Karrablast') {
                        karrablastInPlay = true;
                    }
                });
            });
            if (!karrablastInPlay || player.deck.cards.length === 0) {
                return state;
            }
            // Build blocked list - block cards that don't evolve from Shelmet
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof pokemon_card_1.PokemonCard) || card.evolvesFrom !== 'Shelmet') {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked }), cards => {
                if (cards && cards.length > 0) {
                    const evolutionCard = cards[0];
                    player.deck.moveCardTo(evolutionCard, player.active);
                    player.active.clearEffects();
                    player.active.pokemonPlayedTurn = state.turn;
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.Shelmet = Shelmet;
