"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mawile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Mawile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Astonish',
                cost: [M],
                damage: 0,
                text: 'Flip a coin. If heads, choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into his or her deck.'
            },
            {
                name: 'Big Ol\' Bite',
                cost: [M, C, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mawile';
        this.fullName = 'Mawile PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Astonish
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result && opponent.hand.cards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                    const randomCard = opponent.hand.cards[randomIndex];
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, [randomCard]);
                    opponent.hand.moveCardTo(randomCard, opponent.deck);
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                }
            });
        }
        // Attack 2: Big Ol' Bite
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_2.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Mawile = Mawile;
