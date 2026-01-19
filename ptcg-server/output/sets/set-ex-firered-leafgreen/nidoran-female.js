"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NidoranFemale = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class NidoranFemale extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Look for Friends',
                cost: [C],
                damage: 0,
                text: 'Reveal cards from your deck until you reveal a Basic Pokémon. Show that card to your opponent and put it into your hand. Shuffle the other revealed cards into your deck. (If you don\'t reveal a Basic Pokémon, shuffle all the revealed cards back into your deck.)'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Nidoran F';
        this.fullName = 'Nidoran F RG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            const cards = [];
            let pokemon;
            for (let i = 0; i < player.deck.cards.length; i++) {
                const card = player.deck.cards[i];
                cards.push(card);
                if (card instanceof pokemon_card_1.PokemonCard && card.stage === card_types_1.Stage.BASIC) {
                    pokemon = card;
                    break;
                }
            }
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, cards);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
            if (pokemon !== undefined) {
                player.deck.moveCardTo(pokemon, player.hand);
            }
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        return state;
    }
}
exports.NidoranFemale = NidoranFemale;
